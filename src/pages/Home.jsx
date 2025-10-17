import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const cards = [
    {
      title: 'Patient Appointments',
      desc: 'Book, manage, and track appointments across hospitals.',
      to: '/appointments',
    },
    {
      title: 'Medical Records',
      desc: 'Secure, PIN-protected access to medical histories and documents.',
      to: '/records',
    },
    {
      title: 'Doctor Workflow',
      desc: 'QR-based identification, notes, prescriptions, and lab orders.',
      to: '/doctor',
    },
    {
      title: 'Laboratory Services',
      desc: 'Test requests, scheduling, and patient notifications.',
      to: '/lab',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        Smart Healthcare System
      </h1>
      <p className="text-gray-600 mb-8">
        Unified platform for appointments, records, clinical workflows, and labs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-700">{c.title}</h2>
            <p className="mt-2 text-gray-700">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
