import React from 'react';

export default function Badge({ children, color = 'blue', variant = 'soft', className = '' }) {
  const palette = {
    blue: {
      soft: 'bg-blue-50 text-blue-700 ring-blue-200',
      solid: 'bg-blue-600 text-white ring-blue-600/10',
    },
    green: {
      soft: 'bg-green-50 text-green-700 ring-green-200',
      solid: 'bg-green-600 text-white ring-green-600/10',
    },
    red: {
      soft: 'bg-red-50 text-red-700 ring-red-200',
      solid: 'bg-red-600 text-white ring-red-600/10',
    },
    gray: {
      soft: 'bg-gray-50 text-gray-700 ring-gray-200',
      solid: 'bg-gray-700 text-white ring-gray-700/10',
    },
    yellow: {
      soft: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
      solid: 'bg-yellow-500 text-white ring-yellow-500/10',
    },
  };
  const style = palette[color]?.[variant] || palette.blue.soft;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style} ${className}`}>
      {children}
    </span>
  );
}
