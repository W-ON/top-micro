import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteUserModal } from './DeleteUserModal';
import type { User } from '../types/user';

const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '12345678901',
  phone: '11987654321',
  address: 'Rua Exemplo, 123',
  createdAt: '2024-01-01T10:00:00.000Z',
  updatedAt: '2024-01-01T10:00:00.000Z',
};

describe('DeleteUserModal', () => {
  it('should not render when user is null', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
      <DeleteUserModal
        open={true}
        user={null}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render modal when open and user is provided', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
  });

  it('should display user information', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    expect(screen.getByText('12345678901')).toBeInTheDocument();
  });

  it('should display warning message', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByText('Esta ação não pode ser desfeita!')
    ).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when delete button is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when loading', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
        loading={true}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const deleteButton = screen.getByRole('button', { name: /excluindo/i });

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should show loading text when loading', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
        loading={true}
      />
    );

    expect(screen.getByText('Excluindo...')).toBeInTheDocument();
  });

  it('should render with correct dialog title', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const title = screen.getByText('Confirmar Exclusão');
    expect(title).toBeInTheDocument();
  });

  it('should have delete button with error color', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteUserModal
        open={true}
        user={mockUser}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /excluir/i });
    expect(deleteButton).toHaveClass('MuiButton-containedError');
  });
});
