import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserForm } from './UserForm';

// Mock do hook useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

// Mock dos hooks customizados
vi.mock('../hooks/useUsers', () => ({
  useUser: () => ({ data: null, isLoading: false }),
  useCreateUser: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
  useUpdateUser: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('UserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields', () => {
    renderWithProviders(<UserForm />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
  });

  it('should render title for new user', () => {
    renderWithProviders(<UserForm />);

    expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
    expect(
      screen.getByText('Preencha os dados do novo usuário')
    ).toBeInTheDocument();
  });

  it('should render submit button', () => {
    renderWithProviders(<UserForm />);

    const submitButton = screen.getByRole('button', { name: /criar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    renderWithProviders(<UserForm />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it('should navigate back when cancel button is clicked', () => {
    renderWithProviders(<UserForm />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate back when back button is clicked', () => {
    renderWithProviders(<UserForm />);

    const backButton = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should display validation errors for empty fields', async () => {
    renderWithProviders(<UserForm />);

    const submitButton = screen.getByRole('button', { name: /criar/i });

    // Preenche um campo para habilitar o botão
    const nameInput = screen.getByLabelText(/nome completo/i);
    fireEvent.change(nameInput, { target: { value: 'Test' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('should format CPF while typing', () => {
    renderWithProviders(<UserForm />);

    const cpfInput = screen.getByLabelText(/cpf/i) as HTMLInputElement;
    fireEvent.change(cpfInput, { target: { value: '12345678901' } });

    expect(cpfInput.value).toBe('123.456.789-01');
  });

  it('should format phone while typing', () => {
    renderWithProviders(<UserForm />);

    const phoneInput = screen.getByLabelText(/telefone/i) as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '11987654321' } });

    expect(phoneInput.value).toBe('(11) 98765-4321');
  });

  it('should validate invalid email', async () => {
    renderWithProviders(<UserForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole('button', { name: /criar/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument();
    });
  });

  it('should have submit button disabled when form is not dirty', () => {
    renderWithProviders(<UserForm />);

    const submitButton = screen.getByRole('button', { name: /criar/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is dirty', () => {
    renderWithProviders(<UserForm />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    const submitButton = screen.getByRole('button', { name: /criar/i });

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('should render all required field indicators', () => {
    renderWithProviders(<UserForm />);

    const requiredInputs = screen.getAllByRole('textbox', { name: /\*/i });
    expect(requiredInputs.length).toBeGreaterThan(0);
  });
});
