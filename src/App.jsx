import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Patients from './pages/Patients';
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import IssueLabRequest from './pages/doctor/IssueLabRequest';
import DoctorConsult from './pages/doctor/DoctorConsult';
import { useDoctorAuth } from './store/doctorAuth';
import LabLogin from './pages/lab/LabLogin';
import LabDashboard from './pages/lab/LabDashboard';
import Lab from './pages/lab/Lab';
import { useLabAuth } from './store/labAuth';
import Admin from './pages/admin/Admin';
import AdminLogin from './pages/admin/AdminLogin';
import { useAuth } from './store/auth';
import LabScheduling from './pages/patient/LabScheduling';
import PatientLogin from './pages/patient/PatientLogin';
import PatientDashboard from './pages/patient/PatientDashboard';
import Records from './pages/records/Records';
import { usePatientAuth } from './store/patientAuth';

function Protected({ children }) {
  const token = useAuth((s) => s.token);
  if (!token) {
    return children?.type?.name === 'AdminLogin' ? children : <AdminLogin />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<DoctorProtected><DoctorConsult /></DoctorProtected>} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorProtected><DoctorDashboard /></DoctorProtected>} />
          <Route path="/doctor/lab-request" element={<DoctorProtected><IssueLabRequest /></DoctorProtected>} />
          <Route path="/lab/login" element={<LabLogin />} />
          <Route path="/lab/dashboard" element={<LabProtected><LabDashboard /></LabProtected>} />
          <Route path="/lab/services" element={<LabProtected><Lab /></LabProtected>} />
          <Route path="/admin" element={<Protected><Admin /></Protected>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/patient/lab-scheduling" element={<PatientProtected><LabScheduling /></PatientProtected>} />
          <Route path="/records" element={<PatientProtected><Records /></PatientProtected>} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/dashboard" element={<PatientProtected><PatientDashboard /></PatientProtected>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

function PatientProtected({ children }) {
  const token = usePatientAuth((s) => s.token);
  if (!token) return <PatientLogin />;
  return children;
}

function DoctorProtected({ children }) {
  const token = useDoctorAuth((s) => s.token);
  if (!token) return <DoctorLogin />;
  return children;
}

function LabProtected({ children }) {
  const token = useLabAuth((s) => s.token);
  if (!token) return <LabLogin />;
  return children;
}
