import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  refresh: () => api.post('/auth/refresh'),
};

export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  getAll: (params?: any) => api.get('/users', { params }),
};

export const businessApi = {
  getAll: (params?: any) => api.get('/businesses', { params }),
  getAllAdmin: (params?: any) => api.get('/businesses/admin/all', { params }),
  getMine: () => api.get('/businesses/my'),
  getOne: (id: string) => api.get(`/businesses/${id}`),
  create: (data: any) => api.post('/businesses', data),
  update: (id: string, data: any) => api.patch(`/businesses/${id}`, data),
  submit: (id: string) => api.post(`/businesses/${id}/submit`),
  approve: (id: string) => api.post(`/businesses/${id}/approve`),
  reject: (id: string, reason: string) => api.post(`/businesses/${id}/reject`, { reason }),
  delete: (id: string) => api.delete(`/businesses/${id}`),
};

export const investmentApi = {
  create: (data: any) => api.post('/investments', data),
  getAll: (params?: any) => api.get('/investments', { params }),
  getMine: () => api.get('/investments/my'),
  getPortfolio: () => api.get('/investments/my/portfolio'),
  getOne: (id: string) => api.get(`/investments/${id}`),
};

export const walletApi = {
  get: () => api.get('/wallet'),
  deposit: (amount: number) => api.post('/wallet/deposit', { amount }),
  withdraw: (amount: number) => api.post('/wallet/withdraw', { amount }),
  getTransactions: (params?: any) => api.get('/wallet/transactions', { params }),
};

export const escrowApi = {
  getAll: (params?: any) => api.get('/escrow', { params }),
  release: (id: string, notes?: string) => api.post(`/escrow/${id}/release`, { notes }),
  refund: (id: string, reason: string) => api.post(`/escrow/${id}/refund`, { reason }),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPendingKYC: () => api.get('/admin/kyc/pending'),
  approveKYC: (userId: string) => api.post(`/admin/kyc/${userId}/approve`),
  rejectKYC: (userId: string) => api.post(`/admin/kyc/${userId}/reject`),
};

export const notificationsApi = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export default api;
