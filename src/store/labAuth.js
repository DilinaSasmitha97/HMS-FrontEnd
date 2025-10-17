import { create } from 'zustand';

export const useLabAuth = create((set) => ({
  token: localStorage.getItem('lab_token') || '',
  lab: JSON.parse(localStorage.getItem('lab_info') || 'null'),
  setAuth: ({ token, lab }) => {
    localStorage.setItem('lab_token', token || '');
    localStorage.setItem('lab_info', JSON.stringify(lab || null));
    set({ token, lab });
  },
  clear: () => {
    localStorage.removeItem('lab_token');
    localStorage.removeItem('lab_info');
    set({ token: '', lab: null });
  },
}));
