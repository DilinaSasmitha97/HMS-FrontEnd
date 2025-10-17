import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Stepper from '../../components/ui/Stepper';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../lib/api';

const steps = ['Hospital & Doctor', 'Date & Time', 'Payment', 'Review'];

export default function Appointments() {
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({
    hospital: '',
    doctor: '',
    date: '',
    time: '',
    payment: 'cash',
  });
  const { data: hospitals } = useFetch('/api/hospitals', []);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    async function loadDoctors() {
      if (!form.hospital) {
        setDoctors([]);
        return;
      }
      const res = await api.get(`/api/doctors?hospitalId=${form.hospital}`);
      setDoctors(res.data || []);
    }
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.hospital]);

  const next = () => setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const back = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Book Appointment</h1>
      <Stepper steps={steps} current={current} />
      <Card>
        {current === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })}>
              <option value="">Select hospital</option>
              {(hospitals || []).map((h) => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </Select>
            <Select label="Doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} disabled={!form.hospital}>
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>
              ))}
            </Select>
          </div>
        )}
        {current === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="date" label="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input type="time" label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
        )}
        {current === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Payment Method" value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="insurance">Insurance</option>
            </Select>
            {form.payment === 'insurance' && (
              <Input label="Insurance Policy Number" placeholder="e.g., ABC-123-XYZ" />
            )}
          </div>
        )}
        {current === 3 && (
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Hospital:</span> {form.hospital || '-'}</p>
            <p><span className="font-medium">Doctor:</span> {form.doctor || '-'}</p>
            <p><span className="font-medium">Date:</span> {form.date || '-'}</p>
            <p><span className="font-medium">Time:</span> {form.time || '-'}</p>
            <p><span className="font-medium">Payment:</span> {form.payment}</p>
          </div>
        )}
        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={back} disabled={current === 0}>
            Back
          </Button>
          {current < steps.length - 1 ? (
            <Button onClick={next} disabled={current === 0 && (!form.hospital || !form.doctor)}>
              Next
            </Button>
          ) : (
            <Button
              onClick={async () => {
                const datetime = new Date(`${form.date}T${form.time}:00`);
                // Demo: pick the first patient for now, later wire to auth/selector
                const patients = await api.get('/api/patients');
                const patient = patients.data[0];
                if (!patient) return alert('Please create a patient first.');
                await api.post('/api/appointments', {
                  patient: patient._id,
                  doctor: form.doctor,
                  hospital: form.hospital,
                  datetime,
                  payment: form.payment,
                });
                alert('Appointment booked!');
              }}
              disabled={!form.date || !form.time}
            >
              Confirm Booking
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
