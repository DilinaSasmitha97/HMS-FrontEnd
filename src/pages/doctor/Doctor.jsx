import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api } from '../../lib/api';
import Select from '../../components/ui/Select';

export default function Doctor() {
  const [qr, setQr] = useState('');
  const [note, setNote] = useState('');
  const [prescription, setPrescription] = useState('');
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get('/api/patients');
      setPatients(res.data || []);
    }
    load();
  }, []);

  async function unlock() {
    if (!patientId || !pin) return;
    await api.post('/api/records/access', { patientId, pin });
    setUnlocked(true);
    const recs = await api.get(`/api/records?patientId=${patientId}`);
    setRecords(recs.data || []);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Doctor Examination</h1>
      <Card title="Identify Patient">
        <div className="grid gap-3 sm:grid-cols-3">
          <Select label="Patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </Select>
          <Input label="PIN" type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={unlock} disabled={!patientId || !pin}>Unlock</Button>
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <Input label="Scan/Enter QR (optional)" placeholder="e.g., PAT-QR-123" value={qr} onChange={(e) => setQr(e.target.value)} />
          <div className="flex items-end">
            <Button variant="secondary" onClick={() => alert(`Lookup by QR (mock): ${qr}`)}>Lookup</Button>
          </div>
        </div>
      </Card>
      {unlocked && (
        <>
          <Card title="Existing Records">
            {records.length === 0 ? (
              <p className="text-gray-600">No records yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {records.map((r) => (
                  <li key={r._id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{r.type}</p>
                        <p className="text-sm text-gray-600">{r.summary}</p>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Doctor Note">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Notes</span>
              <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <div className="mt-3">
              <Button
                onClick={async () => {
                  if (!patientId || !pin || !note) return;
                  await api.post('/api/records/with-pin', {
                    patientId,
                    pin,
                    type: 'note',
                    summary: note,
                    data: { source: 'doctor' },
                  });
                  setNote('');
                  const recs = await api.get(`/api/records?patientId=${patientId}`);
                  setRecords(recs.data || []);
                }}
              >
                Save Note
              </Button>
            </div>
          </Card>

          <Card title="Prescription">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Medications</span>
              <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows={3} value={prescription} onChange={(e) => setPrescription(e.target.value)} />
            </label>
            <div className="mt-3 flex gap-3">
              <Button
                onClick={async () => {
                  if (!patientId || !pin || !prescription) return;
                  await api.post('/api/records/with-pin', {
                    patientId,
                    pin,
                    type: 'prescription',
                    summary: prescription,
                    data: { medications: prescription },
                  });
                  setPrescription('');
                  const recs = await api.get(`/api/records?patientId=${patientId}`);
                  setRecords(recs.data || []);
                }}
              >
                Save Prescription
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  // Optional quick lab request from doctor flow (does not require PIN)
                  const doctors = await api.get('/api/doctors');
                  const d = doctors.data[0];
                  if (!patientId || !d) return alert('Create a doctor first.');
                  await api.post('/api/lab/requests', {
                    patient: patientId,
                    orderedBy: d._id,
                    test: 'CBC',
                    urgency: 'Normal',
                  });
                  alert('Lab test requested!');
                }}
              >
                Request Lab Test
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
