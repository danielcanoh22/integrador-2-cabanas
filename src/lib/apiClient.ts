import Cookies from 'js-cookie';
import { refreshToken } from '@/services/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get('accessToken');

  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401 || res.status === 500) {
    try {
      const newAccessToken = await refreshToken();
      Cookies.set('accessToken', newAccessToken);

      headers['Authorization'] = `Bearer ${newAccessToken}`;
      res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    } catch (refreshError) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Ocurrió un error en la petición');
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  const text = await res.text();
  if (!text || text.trim() === '') {
    return null;
  }

  return JSON.parse(text);
}
