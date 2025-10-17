import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Plus, Clipboard, Users, Building, Clock } from 'lucide-react';

export default function Admin() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Hospital
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  // Doctor
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpec, setDoctorSpec] = useState('');
  const [doctorHospital, setDoctorHospital] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');
  // Patient
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  // created patient info (PIN shown after creation)
  const [createdPatientPin, setCreatedPatientPin] = useState('');
  const [createdPatientName, setCreatedPatientName] = useState('');
  // Lab
  const [labPatient, setLabPatient] = useState('');
  const [labDoctor, setLabDoctor] = useState('');
  const [labTest, setLabTest] = useState('');
  const [labUrgency, setLabUrgency] = useState('Normal');

  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  // Lab mgmt
  const [labName, setLabName] = useState('');
  const [labAddress, setLabAddress] = useState('');
  const [labEmail, setLabEmail] = useState('');
  const [labPassword, setLabPassword] = useState('');
  const [labSlots, setLabSlots] = useState('');
  const [labSelectId, setLabSelectId] = useState('');
  const [labs, setLabs] = useState([]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  async function refreshLists() {
    try {
      setLoading(true);
      const [hRes, dRes, pRes, labsRes] = await Promise.all([
        api.get('/api/hospitals'),
        api.get('/api/doctors'),
        api.get('/api/patients'),
        api.get('/api/lab/labs'),
      ]);
      setHospitals(hRes.data || []);
      setDoctors(dRes.data || []);
      setPatients(pRes.data || []);
      setLabs(labsRes.data || []);
    } catch (error) {
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshLists();
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'hospitals', name: 'Hospitals' },
    { id: 'doctors', name: 'Doctors' },
    { id: 'patients', name: 'Patients' },
    { id: 'labs', name: 'Laboratories' },
  
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Top Accent Bar */}
     
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm rounded-b-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-blue-800">Admin Dashboard</div>
              <p className="mt-1 text-sm text-gray-600">Manage your hospital management system</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={refreshLists} className="flex items-center gap-2 text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`rounded-md px-5 py-3 shadow-xl border ${
              notification.type === 'success'
                ? 'bg-white border-green-200 text-green-800'
                : 'bg-white border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold">
                {notification.type === 'success' ? 'Success' : 'Error'}
              </span>
              <span className="text-sm">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-white  shadow-sm border border-blue-100 p-2">
          <nav className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="ring-1 ring-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Hospitals</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{hospitals.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                  <Card className="ring-1 ring-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Doctors</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{doctors.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                  <Card className="ring-1 ring-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Patients</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{patients.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                  <Card className="ring-1 ring-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Labs</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{labs.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card title="Recent Hospitals">
                    <div className="space-y-3 mt-4">
                      {hospitals.slice(0, 5).map((h) => (
                        <div key={h._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">{h.name}</p>
                            <p className="text-sm text-gray-500">{h.address}</p>
                          </div>
                        </div>
                      ))}
                      {hospitals.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hospitals added yet</p>
                      )}
                    </div>
                  </Card>

                  <Card title="Recent Doctors">
                    <div className="space-y-3 mt-4">
                      {doctors.slice(0, 5).map((d) => (
                        <div key={d._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">
                          <div>
                            <p className="font-medium text-gray-900">{d.name}</p>
                            <p className="text-sm text-blue-600">{d.specialty}</p>
                          </div>
                        </div>
                      ))}
                      {doctors.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No doctors added yet</p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Hospitals Tab */}
            {activeTab === 'hospitals' && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card title="Create New Hospital" icon={<Plus className="w-4 h-4" />} className="sticky top-6">
                    <div className="space-y-4 mt-4">
                      <Input 
                        label="Hospital Name" 
                        placeholder="Enter hospital name"
                        value={hospitalName} 
                        onChange={(e) => setHospitalName(e.target.value)} 
                      />
                      <Input 
                        label="Address" 
                        placeholder="Enter hospital address"
                        value={hospitalAddress} 
                        onChange={(e) => setHospitalAddress(e.target.value)} 
                      />
                      <Button
                        className="w-full"
                        onClick={async () => {
                          if (!hospitalName) {
                            showNotification('Please enter hospital name', 'error');
                            return;
                          }
                          try {
                            await api.post('/api/hospitals', { name: hospitalName, address: hospitalAddress });
                            setHospitalName('');
                            setHospitalAddress('');
                            await refreshLists();
                            showNotification('Hospital created successfully!');
                          } catch (error) {
                            showNotification('Error creating hospital', 'error');
                          }
                        }}
                      >
                        Create Hospital
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card title={`All Hospitals (${hospitals.length})`} icon={<Clipboard className="w-4 h-4" />}>
                    <div className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
                      {hospitals.map((h) => (
                        <div key={h._id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{h.name}</h3>
                              <p className="text-gray-600 mt-1">{h.address}</p>
                            </div>
                            <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hospitals.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No hospitals found</p>
                          <p className="text-sm text-gray-400 mt-2">Create your first hospital using the form</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card title="Create New Doctor" icon={<Plus className="w-4 h-4" />} className="sticky top-6">
                    <div className="space-y-4 mt-4">
                      <Input 
                        label="Doctor Name" 
                        placeholder="Enter doctor name"
                        value={doctorName} 
                        onChange={(e) => setDoctorName(e.target.value)} 
                      />
                      <Input 
                        label="Email" 
                        type="email"
                        placeholder="doctor@example.com"
                        value={doctorEmail} 
                        onChange={(e) => setDoctorEmail(e.target.value)} 
                      />
                      <Input 
                        label="Password (min 6 chars)" 
                        type="password"
                        placeholder="Enter password"
                        value={doctorPassword} 
                        onChange={(e) => setDoctorPassword(e.target.value)} 
                      />
                      <Input 
                        label="Specialty" 
                        placeholder="e.g., Cardiology"
                        value={doctorSpec} 
                        onChange={(e) => setDoctorSpec(e.target.value)} 
                      />
                      {/* Hospital is not set at create-time; doctors will choose hospital when setting availability */}
                      <Button
                        className="w-full"
                        onClick={async () => {
                          if (!doctorName || !doctorEmail || !doctorPassword || doctorPassword.length < 6) {
                            showNotification('Please fill all required fields', 'error');
                            return;
                          }
                          try {
                            await api.post('/api/doctors', { name: doctorName, specialty: doctorSpec, email: doctorEmail, password: doctorPassword });
                            setDoctorName('');
                            setDoctorSpec('');
                            setDoctorEmail('');
                            setDoctorPassword('');
                            await refreshLists();
                            showNotification('Doctor created successfully!');
                          } catch (error) {
                            const msg = error?.response?.data?.message || 'Error creating doctor';
                            showNotification(msg, 'error');
                          }
                        }}
                      >
                        Create Doctor
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card title={`All Doctors (${doctors.length})`} icon={<Users className="w-4 h-4" />}>
                    <div className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
                      {doctors.map((d) => (
                        <div key={d._id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{d.name}</h3>
                              <p className="text-blue-600 mt-1">{d.specialty}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Hospital: {hospitals.find(h => h._id === d.hospital)?.name || 'Set via availability'}
                              </p>
                            </div>
                            <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                      {doctors.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No doctors found</p>
                          <p className="text-sm text-gray-400 mt-2">Create your first doctor using the form</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card title="Create New Patient" icon={<Plus className="w-4 h-4" />} className="sticky top-6">
                    <div className="space-y-4 mt-4">
                      <Input 
                        label="Patient Name" 
                        placeholder="Enter patient name"
                        value={patientName} 
                        onChange={(e) => setPatientName(e.target.value)} 
                      />
                      <Input 
                        label="Email" 
                        type="email"
                        placeholder="patient@example.com"
                        value={patientEmail} 
                        onChange={(e) => setPatientEmail(e.target.value)} 
                      />
                      <Input 
                        label="Contact Number" 
                        placeholder="Enter phone number"
                        value={patientPhone} 
                        onChange={(e) => setPatientPhone(e.target.value)} 
                      />
                      <Input 
                        label="Address" 
                        placeholder="Enter address"
                        value={patientAddress} 
                        onChange={(e) => setPatientAddress(e.target.value)} 
                      />
                      {/* PIN is auto-generated (8 digits). It will be shown after creation and can be downloaded as a QR code. */}
                      <Input 
                        label="Password (min 6 chars)" 
                        type="password"
                        placeholder="Enter account password"
                        value={patientPassword} 
                        onChange={(e) => setPatientPassword(e.target.value)} 
                      />
                      <Button
                        className="w-full"
                        onClick={async () => {
                          if (!patientName || !patientEmail || !patientPassword || patientPassword.length < 6) {
                            showNotification('Please fill all required fields', 'error');
                            return;
                          }
                          try {
                            // Generate an 8-digit numeric PIN
                            const genPin = String(Math.floor(10000000 + Math.random() * 90000000));
                            await api.post('/api/patients', {
                              name: patientName,
                              email: patientEmail,
                              contactNumber: patientPhone,
                              address: patientAddress,
                              pin: genPin,
                              password: patientPassword,
                            });
                            setCreatedPatientPin(genPin);
                            setCreatedPatientName(patientName || '');
                            setPatientName('');
                            setPatientEmail('');
                            setPatientPhone('');
                            setPatientAddress('');
                            setPatientPassword('');
                            await refreshLists();
                            showNotification('Patient created successfully!');
                          } catch (error) {
                            const msg = error?.response?.data?.message || 'Error creating patient';
                            showNotification(msg, 'error');
                          }
                        }}
                      >
                        Create Patient
                      </Button>

                      {/* Created patient PIN and QR download */}
                      {createdPatientPin ? (
                        <div className="mt-4 p-3 border border-green-100 rounded bg-white">
                          <p className="text-sm text-gray-700">Created patient: <strong>{createdPatientName}</strong></p>
                          <p className="text-sm text-gray-700">PIN: <span className="font-mono text-lg">{createdPatientPin}</span></p>
                          <div className="mt-2 flex items-center gap-2">
                            <img alt="PIN QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(createdPatientPin)}`} className="w-20 h-20 border rounded" />
                            <div className="flex flex-col">
                              <a
                                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                                href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(createdPatientPin)}`}
                                download={`patient-${createdPatientName || 'pin'}.png`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download PIN QR
                              </a>
                              <button
                                type="button"
                                className="mt-2 text-sm text-gray-600 underline"
                                onClick={() => { navigator.clipboard?.writeText(createdPatientPin); showNotification('PIN copied to clipboard'); }}
                              >
                                Copy PIN
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card title={`All Patients (${patients.length})`} icon={<Users className="w-4 h-4" />}>
                    <div className="space-y-3 mt-4 max-h-[600px] overflow-y-auto">
                      {patients.map((p) => (
                        <div key={p._id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{p.name}</h3>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-600">Email: {p.email}</p>
                                <p className="text-sm text-gray-600">Phone: {p.contactNumber}</p>
                                <p className="text-sm text-gray-600">Address: {p.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* QR preview */}
                              {p.pin ? (
                                <>
                                  <img alt="QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(p.pin)}`} className="w-12 h-12 border rounded" />
                                  <div className="flex flex-col">
                                    <a
                                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                                      href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(p.pin)}`}
                                      download={`patient-${p.name || p._id}-pin.png`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Download QR
                                    </a>
                                    <button
                                      type="button"
                                      className="mt-2 text-sm text-gray-600 underline"
                                      onClick={() => { navigator.clipboard?.writeText(p.pin); showNotification('PIN copied to clipboard'); }}
                                    >
                                      Copy PIN
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="text-sm text-gray-500">PIN not set</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {patients.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No patients found</p>
                          <p className="text-sm text-gray-400 mt-2">Create your first patient using the form</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Labs Tab */}
            {activeTab === 'labs' && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card title="Create New Laboratory" icon={<Plus className="w-4 h-4" />}>
                    <div className="space-y-4 mt-4">
                      <Input 
                        label="Laboratory Name" 
                        placeholder="Enter lab name"
                        value={labName} 
                        onChange={(e) => setLabName(e.target.value)} 
                      />
                      <Input 
                        label="Address" 
                        placeholder="Enter lab address"
                        value={labAddress} 
                        onChange={(e) => setLabAddress(e.target.value)} 
                      />
                      <Input 
                        label="Email" 
                        type="email"
                        placeholder="lab@example.com"
                        value={labEmail} 
                        onChange={(e) => setLabEmail(e.target.value)} 
                      />
                      <Input 
                        label="Password (min 6 chars)" 
                        type="password"
                        placeholder="Enter password"
                        value={labPassword} 
                        onChange={(e) => setLabPassword(e.target.value)} 
                      />
                      <Button
                        className="w-full"
                        onClick={async () => {
                          if (!labName || !labEmail || !labPassword || labPassword.length < 6) {
                            showNotification('Please fill all required fields', 'error');
                            return;
                          }
                          try {
                            await api.post('/api/lab/labs', { name: labName, address: labAddress, email: labEmail, password: labPassword });
                            setLabName('');
                            setLabAddress('');
                            setLabEmail('');
                            setLabPassword('');
                            await refreshLists();
                            showNotification('Laboratory created successfully!');
                          } catch (error) {
                            showNotification('Error creating laboratory', 'error');
                          }
                        }}
                      >
                        Create Laboratory
                      </Button>
                    </div>
                  </Card>

                  
                </div>

                <Card title={`All Laboratories (${labs.length})`} icon={<Building className="w-4 h-4" />}>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                    {labs.map((l) => (
                      <div key={l._id} className="p-4 border border-gray-200 rounded-md hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{l.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{l.address}</p>
                            {l.email && <p className="text-xs text-gray-500 mt-1">{l.email}</p>}
                            <p className="text-xs text-gray-500 mt-2">
                              Slots: {l.availableSlots?.length || 0}
                            </p>
                          </div>
                          <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                    {labs.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No laboratories found</p>
                        <p className="text-sm text-gray-400 mt-2">Create your first laboratory using the form</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

      
           
          </>
        )}
      </div>
    </div>
  );
}
