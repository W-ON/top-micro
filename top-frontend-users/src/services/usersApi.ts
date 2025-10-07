import axios from 'axios';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
  UsersQueryParams,
} from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const usersApi = {
  // GET /users - Lista usuários com paginação e busca
  getUsers: async (params?: UsersQueryParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('', { params });
    return response.data;
  },

  // GET /users/:id - Busca usuário por ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/${id}`);
    return response.data;
  },

  // POST /users - Cria novo usuário
  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('', data);
    return response.data;
  },

  // PUT /users/:id - Atualiza usuário
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put<User>(`/${id}`, data);
    return response.data;
  },

  // DELETE /users/:id - Remove usuário
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};
