import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { patientApi, api } from '../../lib/api';
import { usePatientAuth } from '../../store/patientAuth';

export default function PatientDashboard() {
  const { patient } = usePatientAuth();
  const patientId = patient?.id;
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [records, setRecords] = useState([]);

  // New appointment form state
  const [doctorId, setDoctorId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [datetime, setDatetime] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [availabilityId, setAvailabilityId] = useState('');

  const totalRecords = records.length;
  const pendingLabs = useMemo(() => labRequests.length, [labRequests]);

  useEffect(() => {
    async function load() {
      if (!patientId) return;
      setLoading(true);
      try {
        const [ap, lr, rec, d, h] = await Promise.all([
          patientApi.get('/api/appointments', { params: { patientId } }),
          patientApi.get('/api/lab/requests', { params: { patientId, status: 'Pending' } }),
          patientApi.get('/api/records', { params: { patientId } }),
          api.get('/api/doctors'),
          api.get('/api/hospitals'),
        ]);
        setAppointments(ap.data || []);
        setLabRequests(lr.data || []);
        setRecords(rec.data || []);
        setDoctors(d.data || []);
        setHospitals(h.data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  useEffect(() => {
    async function loadAvailability() {
      if (!doctorId) {
        setAvailability([]);
        return;
      }
      const av = await api.get('/api/doctors/availability', { params: { doctorId } });
      setAvailability(av.data || []);
      setAvailabilityId('');
      setHospitalId('');
      setDatetime('');
    }
    loadAvailability();
  }, [doctorId]);

  async function createAppointment() {
    if (!patientId || !doctorId || !availabilityId) return;
    const selected = availability.find((a) => a._id === availabilityId);
    if (!selected) return;
    const hId = selected.hospital?._id || hospitalId;
    const dt = selected.start ? new Date(selected.start).toISOString() : datetime;
    await patientApi.post('/api/appointments', {
      patient: patientId,
      doctor: doctorId,
      hospital: hId,
      datetime: dt,
      availabilityId,
    });
    const ap = await patientApi.get('/api/appointments', { params: { patientId } });
    setAppointments(ap.data || []);
    setDoctorId('');
    setHospitalId('');
    setDatetime('');
    setAvailabilityId('');
    setAvailability([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">Welcome, {patient?.name || 'Patient'}</h1>
      </div>

      {loading ? (
        <div className="py-6 grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="ring-1 ring-blue-100" title="New Appointment">
              <div className="space-y-3 mt-2">
                <Select label="Doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                  <option value="">Select a doctor</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} – {d.specialty}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Doctor Availability"
                  value={availabilityId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setAvailabilityId(id);
                    const sel = availability.find((a) => a._id === id);
                    if (sel) {
                      setHospitalId(sel.hospital?._id || '');
                      setDatetime(new Date(sel.start).toISOString().slice(0, 16));
                    }
                  }}
                >
                  <option value="">Select an availability</option>
                  {availability.map((a) => (
                    <option key={a._id} value={a._id}>
                      {new Date(a.start).toLocaleString()} - {new Date(a.end).toLocaleString()} | {a.hospital?.name} | remaining {a.remaining}/
                      {a.capacity}
                    </option>
                  ))}
                </Select>
                <Button onClick={createAppointment} className="w-full">
                  Book Appointment
                </Button>
              </div>
            </Card>

            <Card className="ring-1 ring-blue-100" title={`Pending Lab Requests (${pendingLabs})`}>
              <div className="mt-2 space-y-3 max-h-[280px] overflow-y-auto">
                {labRequests.map((r) => (
                  <div key={r._id} className="p-3 bg-white border border-blue-100 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-blue-900">{r.test || 'Lab Test'}</p>
                      <Badge color="yellow">{r.status}</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Ordered by: {r.orderedBy?.name || 'Doctor'}</p>
                    <div className="mt-2">
                      <Button variant="secondary" onClick={() => navigate(`/patient/lab-scheduling?requestId=${r._id}`)}>
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
                {labRequests.length === 0 && <p className="text-sm text-gray-500">No pending requests</p>}
              </div>
            </Card>

            <Card className="ring-1 ring-blue-100" title="Doctor Availability">
              <div className="mt-2 space-y-3 max-h-[280px] overflow-y-auto">
                {availability.map((a) => (
                  <div key={a._id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{new Date(a.start).toLocaleString()}</p>
                      <Badge color="blue">{a.hospital?.name || '-'}</Badge>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">Remaining: {a.remaining} / {a.capacity}</p>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setAvailabilityId(a._id);
                          setHospitalId(a.hospital?._id || '');
                          setDatetime(new Date(a.start).toISOString());
                        }}
                      >
                        Book this slot
                      </Button>
                    </div>
                  </div>
                ))}
                {availability.length === 0 && <p className="text-sm text-gray-500">Select a doctor to view availability</p>}
              </div>
            </Card>
          </div>

          <Card className="ring-1 ring-blue-100" title={`Medical Records (${totalRecords})`}>
            <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto">
              {records.map((rec) => (
                <div key={rec._id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{rec.type}</p>
                    <Badge color={rec.type === 'lab' ? 'green' : 'gray'}>{new Date(rec.createdAt).toLocaleDateString()}</Badge>
                  </div>
                  {rec.summary && <p className="text-sm text-gray-600 mt-1">{rec.summary}</p>}
                </div>
              ))}
              {records.length === 0 && <p className="text-sm text-gray-500">No records yet</p>}
            </div>
          </Card>

          <Card className="ring-1 ring-blue-100" title="Tips">
            <p className="text-sm text-gray-600">Use your account login to manage your care. Schedule each pending test via its own card.</p>
          </Card>
        </>
      )}
    </div>
  );
}
