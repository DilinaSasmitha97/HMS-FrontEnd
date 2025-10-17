import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { labApi } from '../../lib/api';
import { useLabAuth } from '../../store/labAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Beaker } from 'lucide-react';

export default function LabLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useLabAuth((s) => s.setAuth);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await labApi.post('/api/lab/login', { email, password });
      setAuth({ token: res.data.token, lab: res.data.lab });
      navigate('/lab/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full">
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-teal-500 text-white flex-col justify-center items-center p-10">
          <Beaker className="w-16 h-16 mb-4 text-white" />
          <h2 className="text-3xl font-bold mb-2">Laboratory Login</h2>
          <p className="text-blue-100 text-center leading-relaxed">Access lab dashboard to manage requests and results.</p>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <Card className="bg-transparent shadow-none border-none">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Welcome</h1>
            <p className="text-gray-500 text-center mb-8 text-sm">Sign in to access your lab dashboard</p>

            <form className="space-y-5" onSubmit={onSubmit}>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lab@example.com" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors duration-200">{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a></p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
