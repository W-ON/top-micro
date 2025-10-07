import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserTable } from './UserTable';
import type { User } from '../types/user';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    phone: '11987654321',
    address: 'Rua Exemplo, 123',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    cpf: '98765432109',
    phone: '11912345678',
    address: 'Av. Teste, 456',
    createdAt: '2024-01-02T10:00:00.000Z',
    updatedAt: '2024-01-02T10:00:00.000Z',
  },
];

describe('UserTable', () => {
  it('should render table with users', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    // Verifica se os nomes estão sendo exibidos
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('should format CPF correctly', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    // Verifica formatação do CPF
    expect(screen.getByText('123.456.789-01')).toBeInTheDocument();
    expect(screen.getByText('987.654.321-09')).toBeInTheDocument();
  });

  it('should format phone correctly', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    // Verifica formatação do telefone
    expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();
    expect(screen.getByText('(11) 91234-5678')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    const editButtons = screen.getAllByLabelText(/editar/i);
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    const deleteButtons = screen.getAllByLabelText(/excluir/i);
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should display loading state', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable
        users={[]}
        onEdit={onEdit}
        onDelete={onDelete}
        loading={true}
      />
    );

    expect(screen.getByText('Carregando usuários...')).toBeInTheDocument();
  });

  it('should display empty state when no users', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={[]} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
  });

  it('should render all table headers', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('CPF')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(screen.getByText('Endereço')).toBeInTheDocument();
    expect(screen.getByText('Criado em')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('should display email and phone in contact column', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
  });

  it('should display address in address column', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserTable users={mockUsers} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText('Rua Exemplo, 123')).toBeInTheDocument();
    expect(screen.getByText('Av. Teste, 456')).toBeInTheDocument();
  });
});
