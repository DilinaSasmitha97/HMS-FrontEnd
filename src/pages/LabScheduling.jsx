import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { api, patientApi } from '../../lib/api';
import { usePatientAuth } from '../../store/patientAuth';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LabScheduling() {
  const { patient } = usePatientAuth();
  const patientId = patient?.id;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const presetRequestId = params.get('requestId') || '';
  const [requests, setRequests] = useState([]);
  const [date, setDate] = useState('');
  // Only hold labs returned by the availability search; do not preload all labs
  const [availableLabs, setAvailableLabs] = useState([]);
  const [labId, setLabId] = useState('');
  const [slot, setSlot] = useState('');
  const [selectedRequest, setSelectedRequest] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const rRes = await patientApi.get('/api/lab/requests', { params: { status: 'Pending', patientId } });
      setRequests(rRes.data || []);
      if (presetRequestId) setSelectedRequest(presetRequestId);
      // Reset labs/selection when opening page or changing patient
      setAvailableLabs([]);
      setLabId('');
      setSlot('');
    }
    load();
  }, [patientId, presetRequestId]);

  const selectedLab = useMemo(()=> availableLabs.find((l) => (l._id || l.id) === labId), [availableLabs, labId]);
  const selectedReqObj = useMemo(()=> requests.find((r)=> r._id === selectedRequest), [requests, selectedRequest]);

  async function findLabs() {
    if (!selectedRequest || !date) return;
    setError('');
    const testType = selectedReqObj?.test || '';
    const res = await api.get('/api/lab/search-availability', { params: { date, testType } });
    setAvailableLabs(res.data || []);
    setLabId('');
    setSlot('');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Schedule Lab Request</h1>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Patient is prefilled from auth; hide picker */}
          <Input label="Patient" value={patient?.name || ''} disabled />
          <Select label="Lab Request" value={selectedRequest} onChange={(e) => setSelectedRequest(e.target.value)} disabled={!!presetRequestId}>
            <option value="">Select request</option>
            {requests.map((r) => (
              <option key={r._id} value={r._id}>{r.test} - {r.patient?.name || r.patient}</option>
            ))}
          </Select>
          {selectedReqObj && (
            <Input label="Test" value={selectedReqObj.test} disabled />
          )}
          <Input label="Date" type="date" value={date} onChange={(e)=> setDate(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={findLabs} disabled={!selectedRequest || !date}>Find Labs</Button>
          </div>
          {availableLabs.length > 0 && (
            <>
              <Select label="Lab" value={labId} onChange={(e) => setLabId(e.target.value)}>
                <option value="">Select lab</option>
                {availableLabs.map((l) => (
                  <option key={l.id || l._id} value={l.id || l._id}>{l.name}</option>
                ))}
              </Select>
              {selectedLab && (
                <Select label="Available Slot" value={slot} onChange={(e) => setSlot(e.target.value)}>
                  <option value="">Select slot</option>
                  {(selectedLab.slots || []).map((s) => (
                    <option key={s} value={s}>{new Date(s).toLocaleTimeString()}</option>
                  ))}
                </Select>
              )}
            </>
          )}
          {availableLabs.length === 0 && date && selectedRequest && (
            <p className="text-sm text-gray-500">No labs available for this test on the selected date.</p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        <div className="mt-4">
          <Button
            onClick={async () => {
              if (!selectedRequest || !labId || !slot) return;
              try {
                setError('');
                await patientApi.post(`/api/lab/requests/${selectedRequest}/schedule-by-patient`, {
                  labId,
                  slot,
                });
                alert('Lab request scheduled!');
                navigate('/patient/dashboard');
              } catch (e) {
                setError(e?.response?.data?.message || 'Failed to schedule. Please try again.');
              }
            }}
          >
            Schedule
          </Button>
        </div>
      </Card>
    </div>
  );
}
