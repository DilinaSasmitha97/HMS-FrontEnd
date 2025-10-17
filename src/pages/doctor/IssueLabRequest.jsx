import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { doctorApi } from '../../lib/api';
import { useDoctorAuth } from '../../store/doctorAuth';

export default function IssueLabRequest() {
  const { doctor } = useDoctorAuth();
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [testKey, setTestKey] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [note, setNote] = useState('');

  useEffect(() => {
    async function load() {
      const [p, t] = await Promise.all([
        doctorApi.get('/api/patients'),
        doctorApi.get('/api/lab/test-types'),
      ]);
      setPatients(p.data || []);
      setTests(t.data || []);
    }
    load();
  }, []);

  async function submit() {
    if (!patientId || !testKey) return;
    const chosen = tests.find((x) => x.key === testKey);
    await doctorApi.post('/api/lab/requests', {
      patient: patientId,
      orderedBy: doctor?.id,
      test: chosen?.name || testKey,
      urgency,
      note,
    });
    setPatientId(''); setTestKey(''); setUrgency('Normal'); setNote('');
    alert('Lab request issued');
  }

  return (
    <div className="space-y-6">
      <Card title="Issue Lab Request">
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <Select label="Patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </Select>
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
        <div className="mt-4">
          <Button onClick={submit}>Create Lab Request</Button>
        </div>
      </Card>
    </div>
  );
}
