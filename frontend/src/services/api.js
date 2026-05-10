// Cliente HTTP centralizado
const API_BASE_URL = 'http://localhost:3000/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('token');

// Cliente base con fetch
const apiClient = async (endpoint, options = {}) => {
  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('unauthorized'));
    }
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
};

// Servicio de autenticación
export const authService = {
  register: (email, password) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// Servicio de platillos
export const dishesService = {
  getPremiumDishes: () => apiClient('/dishes/premium'),
};

// Servicio de usuarios (todos son admin)
export const usersService = {
  getAllUsers: () => apiClient('/users'),
};