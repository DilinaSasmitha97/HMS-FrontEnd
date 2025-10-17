import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { api, patientApi } from '../../lib/api';
import { jsPDF } from 'jspdf';
import { usePatientAuth } from '../../store/patientAuth';

const MOCK_RECORDS = [
  { id: 'R-1001', type: 'Doctor Note', date: '2025-10-01', summary: 'Follow-up in 2 weeks.' },
  { id: 'R-1002', type: 'Prescription', date: '2025-10-01', summary: 'Amoxicillin 500mg BID x7 days.' },
  { id: 'R-1003', type: 'Lab Result', date: '2025-10-02', summary: 'CBC: WBC 6.2, Hb 13.6' },
];

export default function Records() {
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const { patient, token } = usePatientAuth();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // If a patient is logged in (via patient auth), use their id to fetch records

  useEffect(() => {
    async function loadRecords() {
      if (!patient?.id && !token) return;
      const patientId = patient?.id;
      const res = await patientApi.get(`/api/records?patientId=${patientId}`);
      const list = res.data || [];
      setAllRecords(list);
      setRecords(list);
    }
    loadRecords();
  }, [patient, token]);

  // Apply client-side filters/search
  useEffect(() => {
    if (!allRecords || allRecords.length === 0) {
      setRecords([]);
      return;
    }
    const q = (query || '').trim().toLowerCase();
    const fromTs = fromDate ? new Date(fromDate).setHours(0,0,0,0) : null;
    const toTs = toDate ? new Date(toDate).setHours(23,59,59,999) : null;

    const filtered = allRecords.filter((r) => {
      // type filter: backend stores type as 'note'|'prescription'|'lab' or human values
      if (typeFilter) {
        const t = String(r.type || '').toLowerCase();
        if (!t.includes(typeFilter)) return false;
      }
      // date range filter on createdAt
      if (fromTs || toTs) {
        const c = new Date(r.createdAt || r.date || null).getTime();
        if (fromTs && c < fromTs) return false;
        if (toTs && c > toTs) return false;
      }
      // search in summary, type, and any data fields
      if (q) {
        const hay = [r.summary, r.type, JSON.stringify(r.data || {})].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    setRecords(filtered);
  }, [allRecords, query, typeFilter, fromDate, toDate]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Medical Records</h1>
      {!patient ? (
        <Card title="Patient login required" className="max-w-md">
          <p className="text-sm text-gray-600">Please sign in to view your medical records.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Input label="Search" placeholder="Search text or summary" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All</option>
              <option value="note">Doctor Note</option>
              <option value="prescription">Prescription</option>
              <option value="lab">Lab Result</option>
            </Select>
            <Input label="From" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <Input label="To" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Your Records ({records.length})</h2>
            <div>
              <Button
                onClick={() => {
                  // generate PDF
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text('Medical Records', 14, 20);
                  doc.setFontSize(11);
                  let y = 30;
                  records.forEach((r, idx) => {
                    const title = `${idx + 1}. ${r.type} - ${new Date(r.createdAt || r.date).toLocaleDateString()}`;
                    doc.text(title, 14, y);
                    y += 6;
                    const lines = doc.splitTextToSize(r.summary || JSON.stringify(r.data || {}), 180);
                    doc.text(lines, 14, y);
                    y += lines.length * 6 + 4;
                    if (y > 270) { doc.addPage(); y = 20; }
                  });
                  doc.save('medical-records.pdf');
                }}
                className="mr-2"
              >
                Download Report
              </Button>
            </div>
          </div>

          <Card title={``} className="mt-4">
            <ul className="divide-y divide-gray-100">
              {records.map((r) => (
                <li key={r._id || r.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{r.type}</p>
                      <p className="text-sm text-gray-600">{r.summary}</p>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
              {records.length === 0 && <li className="py-6 text-center text-gray-500">No records found</li>}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
 
