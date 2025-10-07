export interface User {
  id: number;
  nome: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  status: string;
  isDeleted: boolean;
  created: string;
  updated: string;
  deleted?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  address?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
