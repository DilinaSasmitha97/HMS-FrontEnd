import React from 'react';

export default function Stepper({ steps = [], current = 0 }) {
  return (
    <ol className="flex items-center gap-4 text-sm text-gray-600">
      {steps.map((s, idx) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              idx <= current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {idx + 1}
          </span>
          <span className={idx === current ? 'font-semibold text-blue-700' : ''}>{s}</span>
          {idx < steps.length - 1 && <span className="mx-2 text-gray-300">/</span>}
        </li>
      ))}
    </ol>
  );
}
