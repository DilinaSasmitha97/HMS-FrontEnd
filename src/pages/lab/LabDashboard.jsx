import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
// Input component removed: results are managed on dedicated page (/lab/services)
import { useNavigate } from 'react-router-dom';
import { labApi } from '../../lib/api';
import { useLabAuth } from '../../store/labAuth';

// Simple day picker: next 14 days
function nextDays(n=14){
  const arr=[]; const now=new Date();
  for(let i=0;i<n;i++){ const d=new Date(now.getFullYear(), now.getMonth(), now.getDate()+i); arr.push(d); }
  return arr;
}
function toDateStr(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

export default function LabDashboard(){
  const { lab } = useLabAuth();
  const [tests, setTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()));
  const [selectedTests, setSelectedTests] = useState([]);
  const [dayInfo, setDayInfo] = useState(null);
  const [scheduled, setScheduled] = useState([]);
  const navigate = useNavigate();

  const days = useMemo(()=>nextDays(21),[]);

  useEffect(()=>{ (async ()=>{
    const tt = await labApi.get('/api/lab/test-types');
    setTests(tt.data||[]);
    const di = await labApi.get(`/api/lab/labs/${lab?.id}/day-availability`, { params: { date: selectedDate } });
    setDayInfo(di.data);
    setSelectedTests(di.data?.testTypes || []);
    const sched = await labApi.get('/api/lab/requests', { params: { status: 'Scheduled' } });
    setScheduled(sched.data || []);
  })(); },[lab?.id, selectedDate]);

  async function save(){
    await labApi.post(`/api/lab/labs/${lab?.id}/day-availability`, {
      date: selectedDate,
      testTypes: selectedTests,
    });
    const di = await labApi.get(`/api/lab/labs/${lab?.id}/day-availability`, { params: { date: selectedDate } });
    setDayInfo(di.data);
  }

  const slotCount = (dayInfo?.slots||[]).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-blue-800">Welcome, {lab?.name}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Set Day Availability">
          <div className="space-y-3 mt-2">
            <Select label="Day" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)}>
              {days.map((d)=> <option key={d.toISOString()} value={toDateStr(d)}>{d.toDateString()}</option>)}
            </Select>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Available Test Types</p>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto p-2 border rounded-md">
                {tests.map((t)=>{
                  const checked = selectedTests.includes(t.name);
                  return (
                    <label key={t.key} className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={checked} onChange={(e)=>{
                        if(e.target.checked) setSelectedTests([...selectedTests, t.name]);
                        else setSelectedTests(selectedTests.filter((x)=>x!==t.name));
                      }} />
                      <span>{t.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <Button onClick={save} className="w-full">Save Day Availability</Button>
          </div>
        </Card>

        <Card title="Overview for Selected Day">
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-700">Slots generated: <span className="font-medium">{slotCount}</span> (20-min windows from 8:30 to 3:00pm)</p>
            <p className="text-sm text-gray-700">Configured tests: <span className="font-medium">{(dayInfo?.testTypes||[]).join(', ')||'-'}</span></p>
            <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto">
              {(dayInfo?.slots||[]).map((s)=> (
                <div key={s} className="text-xs p-2 rounded-md border border-gray-200 text-gray-700">{new Date(s).toLocaleTimeString()}</div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title={`Scheduled Lab Tests (${scheduled.length})`}>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => navigate('/lab/services')}>Go to Lab Services</Button>
        </div>
        <div className="mt-2 space-y-3 max-h-[360px] overflow-y-auto">
          {scheduled.map((r) => (
            <div key={r._id} className="p-3 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-900">{r.test} <span className="text-xs text-gray-500">({r.urgency})</span></p>
              <p className="text-sm text-gray-600">Patient: {r.patient?.name || r.patient}</p>
              <p className="text-xs text-gray-500">When: {r.scheduledAt ? new Date(r.scheduledAt).toLocaleString() : '-'}</p>
              <div className="mt-2">
                <Button variant="secondary" onClick={() => navigate(`/lab/services?requestId=${r._id}`)}>Manage Results</Button>
              </div>
            </div>
          ))}
          {scheduled.length === 0 && <p className="text-sm text-gray-500">No scheduled tests</p>}
        </div>
      </Card>

    </div>
  );
}
