import { create } from 'zustand';

export const useDoctorAuth = create((set) => ({
  token: localStorage.getItem('doctor_token') || '',
  doctor: JSON.parse(localStorage.getItem('doctor_info') || 'null'),
  setAuth: ({ token, doctor }) => {
    localStorage.setItem('doctor_token', token || '');
    localStorage.setItem('doctor_info', JSON.stringify(doctor || null));
    set({ token, doctor });
  },
  clear: () => {
    localStorage.removeItem('doctor_token');
    localStorage.removeItem('doctor_info');
    set({ token: '', doctor: null });
  },
}));
