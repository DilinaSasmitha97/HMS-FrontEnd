import { create } from 'zustand';

export const usePatientAuth = create((set) => ({
  token: localStorage.getItem('patient_token') || '',
  patient: JSON.parse(localStorage.getItem('patient_info') || 'null'),
  setAuth: ({ token, patient }) => {
    localStorage.setItem('patient_token', token || '');
    localStorage.setItem('patient_info', JSON.stringify(patient || null));
    set({ token, patient });
  },
  clear: () => {
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_info');
    set({ token: '', patient: null });
  },
}));
