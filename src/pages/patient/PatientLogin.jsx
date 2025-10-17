import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../../lib/api';
import { usePatientAuth } from '../../store/patientAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User } from 'lucide-react';

export default function PatientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = usePatientAuth((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const res = await patientApi.post('/api/patients/login', { email, password });
      setAuth({ token: res.data.token, patient: res.data.patient });
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full">
        {/* Left branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-teal-500 text-white flex-col justify-center items-center p-10">
          <User className="w-16 h-16 mb-4 text-white" />
          <h2 className="text-3xl font-bold mb-2">Patient Login</h2>
          <p className="text-blue-100 text-center leading-relaxed">
            Access your records, appointments, and lab schedules securely.
          </p>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <Card className="bg-transparent shadow-none border-none">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Welcome</h1>
            <p className="text-gray-500 text-center mb-8 text-sm">Sign in to access your patient dashboard</p>

            <form className="space-y-5" onSubmit={onSubmit}>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors duration-200">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
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
