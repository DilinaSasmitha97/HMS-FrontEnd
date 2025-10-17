import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { doctorApi } from '../../lib/api';
import { useDoctorAuth } from '../../store/doctorAuth';

export default function DoctorConsult() {
  const { doctor } = useDoctorAuth();
  const [pin, setPin] = useState('');
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tests, setTests] = useState([]);
  const [testKey, setTestKey] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [note, setNote] = useState('');
  const [doctorNote, setDoctorNote] = useState('');
  const [prescription, setPrescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setError('');
    try {
      setLoading(true);
      const pRes = await doctorApi.get('/api/patients/lookup', { params: { pin } });
      setPatient(pRes.data);
      const [rec, ap, tt] = await Promise.all([
        doctorApi.get('/api/records', { params: { patientId: pRes.data._id } }),
        doctorApi.get('/api/appointments', { params: { patientId: pRes.data._id } }),
        doctorApi.get('/api/lab/test-types'),
      ]);
      setRecords(rec.data || []);
      setAppointments(ap.data || []);
      setTests(tt.data || []);
    } catch (e) {
      setPatient(null);
      setRecords([]);
      setAppointments([]);
      setTests([]);
      setError(e?.response?.data?.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  }

  async function issueLab() {
    if (!patient || !testKey) return;
    const chosen = tests.find((t) => t.key === testKey);
    await doctorApi.post('/api/lab/requests', {
      patient: patient._id,
      orderedBy: doctor?.id,
      test: chosen?.name || testKey,
      urgency,
      note,
    });
    setTestKey(''); setUrgency('Normal'); setNote('');
    alert('Lab test issued');
  }

  async function saveDoctorNote() {
    if (!patient || !doctorNote) return;
    try {
      await doctorApi.post('/api/records', {
        patient: patient._id,
        type: 'note',
        summary: doctorNote,
        data: { note: doctorNote, createdBy: doctor?.id },
      });
      setDoctorNote('');
      alert('Doctor note saved');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save note');
    }
  }

  async function savePrescription() {
    if (!patient || !prescription) return;
    try {
      await doctorApi.post('/api/records', {
        patient: patient._id,
        type: 'prescription',
        summary: prescription,
        data: { medications: prescription, prescribedBy: doctor?.id },
      });
      setPrescription('');
      alert('Prescription saved');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save prescription');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    lookup();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">Consult New Patient</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Patient PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
            <div className="flex items-end">
              <Button type="submit">Find Patient</Button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </form>
      </Card>

      {loading && (
        <div className="py-8 flex justify-center"><div className="h-10 w-10 rounded-full border-b-2 border-blue-600 animate-spin" /></div>
      )}

      {patient && (
        <>
          <Card title={`Patient: ${patient.name}`}>
            <div className="grid gap-4 md:grid-cols-3 mt-2">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{patient.contactNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{patient.address || '-'}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title={`Medical Records (${records.length})`}>
              <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto">
                {records.map((r) => (
                  <div key={r._id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{r.type}</p>
                    {r.summary && <p className="text-sm text-gray-600 mt-1">{r.summary}</p>}
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                {records.length === 0 && <p className="text-sm text-gray-500">No records yet</p>}
              </div>
            </Card>

            <Card title={`Past Appointments (${appointments.length})`}>
              <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto">
                {appointments.map((a) => (
                  <div key={a._id} className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{new Date(a.datetime).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Doctor: {a.doctor?.name}</p>
                    <p className="text-xs text-gray-500">Hospital: {a.hospital?.name || '-'}</p>
                  </div>
                ))}
                {appointments.length === 0 && <p className="text-sm text-gray-500">No appointments yet</p>}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card title="Issue Lab Test">
            <div className="grid gap-4 md:grid-cols-3 mt-2">
              <Select label="Test Type" value={testKey} onChange={(e) => setTestKey(e.target.value)}>
                <option value="">Select a test</option>
                {tests.map((t) => <option key={t.key} value={t.key}>{t.name} ({t.category})</option>)}
              </Select>
              <Select label="Urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option>Normal</option>
                <option>Urgent</option>
              </Select>
              <Input label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="mt-3">
              <Button onClick={issueLab} disabled={!testKey}>Issue Lab Test</Button>
            </div>
            </Card>

            <Card title="Add Doctor Note">
              <div className="mt-2">
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows={5} value={doctorNote} onChange={(e) => setDoctorNote(e.target.value)} />
                <div className="mt-3 flex justify-end">
                  <Button onClick={saveDoctorNote} disabled={!doctorNote}>Save Note</Button>
                </div>
              </div>
            </Card>

            <Card title="Prescription">
              <div className="mt-2">
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows={4} value={prescription} onChange={(e) => setPrescription(e.target.value)} />
                <div className="mt-3 flex justify-end">
                  <Button onClick={savePrescription} disabled={!prescription}>Save Prescription</Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
