import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { api } from '../../lib/api';

export default function Lab() {
  const [rows, setRows] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [pin, setPin] = useState('');
  const [results, setResults] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const res = await api.get('/api/lab/requests');
      const mapName = (obj) => (typeof obj === 'object' && obj?.name ? obj.name : obj);
      setRows((res.data || []).map((r) => ({
        ...r,
        id: r._id,
        patient: mapName(r.patient),
      })));
    }
    load();
  }, []);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'patient', header: 'Patient' },
    { key: 'test', header: 'Test' },
    { key: 'urgency', header: 'Urgency' },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          {r.status === 'Scheduled' ? (
            <Button variant="secondary" onClick={() => { setActiveId(r.id); setPin(''); setResults(''); setError(''); }}>
              Enter Results
            </Button>
          ) : r.status === 'Completed' ? (
            <span className="text-xs text-green-600">Results submitted</span>
          ) : (
            <span className="text-xs text-gray-500">Awaiting schedule</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Lab Services</h1>
      <Card>
        <Table columns={columns} data={rows} />
      </Card>
      {activeId && (
        <Card title={`Add Results (Request ${activeId})`}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              try {
                // Verify PIN first
                await api.post(`/api/lab/requests/${activeId}/verify-pin`, { pin });
                // Submit completion
                await api.patch(`/api/lab/requests/${activeId}/complete`, { pin, results: safeJson(results), summary: 'Lab results saved' });
                setRows(rows.map((x) => (x.id === activeId ? { ...x, status: 'Completed' } : x)));
                setActiveId(''); setPin(''); setResults('');
                alert('Results saved');
              } catch (err) {
                setError(err?.response?.data?.message || 'Failed to save results');
              }
            }}
            className="space-y-3"
          >
            <Input label="Patient PIN" value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" />
            <div>
              <label className="block text-sm font-medium mb-1">Results (JSON or text)</label>
              <textarea className="w-full border rounded p-2 h-32" value={results} onChange={(e) => setResults(e.target.value)} placeholder='{"value":123, "unit":"mg/dL"}' />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit">Save Results</Button>
              <Button type="button" variant="secondary" onClick={() => { setActiveId(''); setPin(''); setResults(''); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { note: String(text || '').trim() };
  }
}
