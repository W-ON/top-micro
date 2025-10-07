import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FinanceForm } from './FinanceForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
  };
});

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

describe('FinanceForm', () => {
  it('should render form fields', () => {
    renderWithProviders(<FinanceForm />);

    expect(screen.getByText('Nova Finança')).toBeInTheDocument();
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderWithProviders(<FinanceForm />);

    const submitButton = screen.getByRole('button', { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/usuário é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('should show error for invalid valor', async () => {
    renderWithProviders(<FinanceForm />);

    const valorInput = screen.getByLabelText(/valor/i);
    fireEvent.change(valorInput, { target: { value: '-100' } });

    const submitButton = screen.getByRole('button', { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/valor deve ser maior que zero/i)).toBeInTheDocument();
    });
  });

  it('should show error for short description', async () => {
    renderWithProviders(<FinanceForm />);

    const descricaoInput = screen.getByLabelText(/descrição/i);
    fireEvent.change(descricaoInput, { target: { value: 'ab' } });

    const submitButton = screen.getByRole('button', { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/descrição deve ter no mínimo 3 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it('should have cancel button that navigates back', () => {
    renderWithProviders(<FinanceForm />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it('should render tipo select with options', () => {
    renderWithProviders(<FinanceForm />);

    const tipoSelect = screen.getByLabelText(/tipo/i);
    expect(tipoSelect).toBeInTheDocument();
  });

  it('should validate user_id as positive integer', async () => {
    renderWithProviders(<FinanceForm />);

    const userInput = screen.getByLabelText(/usuário/i);
    fireEvent.change(userInput, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /criar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/selecione um usuário válido/i)).toBeInTheDocument();
    });
  });
});
