import { create } from 'zustand';

export const useAuth = create((set) => ({
  token: localStorage.getItem('admin_token') || '',
  admin: JSON.parse(localStorage.getItem('admin_info') || 'null'),
  setAuth: ({ token, admin }) => {
    localStorage.setItem('admin_token', token || '');
    localStorage.setItem('admin_info', JSON.stringify(admin || null));
    set({ token, admin });
  },
  clear: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    set({ token: '', admin: null });
  },
}));
