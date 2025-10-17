import React from 'react';

export default function Card({ title, icon = null, children, className = '' }) {
  return (
    <div className={`rounded-md border border-gray-200 bg-white p-5 shadow ${className}`}>
      {title && (
        <div className="mb-3 flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
              {icon}
            </div>
          )}
          <h2 className="text-lg font-semibold text-blue-800">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}
  