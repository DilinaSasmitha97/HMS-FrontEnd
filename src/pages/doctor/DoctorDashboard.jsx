import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { doctorApi, api } from '../../lib/api';
import { useDoctorAuth } from '../../store/doctorAuth';

export default function DoctorDashboard() {
  const { doctor } = useDoctorAuth();
  const [hospitals, setHospitals] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [hospitalId, setHospitalId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    async function load() {
      const h = await api.get('/api/hospitals');
      setHospitals(h.data || []);
      const av = await api.get('/api/doctors/availability', { params: { doctorId: doctor?.id } });
      setAvailability(av.data || []);
    }
    load();
  }, [doctor?.id]);

  async function addAvailability() {
    if (!doctor?.id || !hospitalId || !start || !end || !capacity) return;
    await doctorApi.post('/api/doctors/availability', {
      doctorId: doctor.id,
      hospitalId,
      start,
      end,
      capacity: Number(capacity),
    });
    const av = await api.get('/api/doctors/availability', { params: { doctorId: doctor.id } });
    setAvailability(av.data || []);
    setHospitalId(''); setStart(''); setEnd(''); setCapacity('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-blue-800">Hello Dr. {doctor?.name}</div>
        <a href="/appointments" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium !text-white hover:bg-blue-700">Consult New Patient</a>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Add Availability">
          <div className="space-y-3 mt-2">
            <Select label="Hospital" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
              <option value="">Select hospital</option>
              {hospitals.map((h) => <option key={h._id} value={h._id}>{h.name}</option>)}
            </Select>
            <Input label="Start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input label="End" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            <Input label="Capacity (patients)" type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            <Button onClick={addAvailability} className="w-full">Add</Button>
          </div>
        </Card>
        <Card title={`Upcoming Availability (${availability.length})`}>
          <div className="mt-2 space-y-3 max-h-[320px] overflow-y-auto">
            {availability.map((a) => (
              <div key={a._id} className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">{new Date(a.start).toLocaleString()} - {new Date(a.end).toLocaleString()}</p>
                <p className="text-sm text-gray-600">{a.hospital?.name}</p>
                <p className="text-xs text-blue-700">Remaining: {a.remaining} / {a.capacity}</p>
              </div>
            ))}
            {availability.length === 0 && <p className="text-sm text-gray-500">No availability yet</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
