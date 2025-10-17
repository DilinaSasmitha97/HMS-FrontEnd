import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
// Removed: import { Mail, Phone, User, Loader2 } from 'lucide-react'; 

// Load Tailwind CSS for aesthetic and responsive design
const containerClass = "p-4 sm:p-8 bg-gray-50 min-h-screen font-sans";
const cardClass = "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100";
const headerClass = "text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2";

// Spinner component using only CSS and SVG
const Spinner = () => (
  <svg className="animate-spin w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Inline SVG Icons (Replacing Lucide)
const UserIcon = ({ className = "w-5 h-5 mr-2" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
);

const MailIcon = ({ className = "w-4 h-4 mr-2 text-gray-500" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1-4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"></path>
    </svg>
);

const PhoneIcon = ({ className = "w-4 h-4 mr-2 text-gray-500" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
    </svg>
);


const App = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
  // When using Vite proxy, this relative path is proxied to backend
  const res = await api.get('/api/patients');
        setPatients(res.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError('Failed to fetch patient data. Ensure the backend server is running and connected to MongoDB.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className={`${containerClass} flex justify-center items-center`}>
        <Spinner />
        <p className="ml-3 text-lg text-gray-600">Loading Patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClass} text-red-600`}>
        <h1 className={headerClass}>Patients List</h1>
        <p className={cardClass}>{error}</p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h1 className={headerClass}>Registered Patients ({patients.length})</h1>
      
      {patients.length === 0 ? (
          <p className="text-xl text-gray-500 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              No patients found. Please add a patient via the POST endpoint first.
          </p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div key={patient._id} className={cardClass}>
                {/* Patient Name */}
                <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center">
                  <UserIcon />
                  {patient.name}
                </h2>
                
                {/* Email */}
                <p className="text-gray-700 mt-2 flex items-center">
                  <MailIcon />
                  {patient.email}
                </p>

                {/* Contact Number */}
                <p className="text-gray-700 mt-1 flex items-center">
                  <PhoneIcon />
                  {patient.contactNumber || 'N/A'}
                </p>

                {/* Address */}
                <p className="text-gray-600 text-sm mt-3 border-t pt-2">
                  {patient.address || 'Address not provided'}
                </p>
                
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default App;
