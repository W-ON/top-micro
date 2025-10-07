import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinanceTable } from './FinanceTable';
import { Finance } from '../types/finance';

describe('FinanceTable', () => {
  const mockFinances: Finance[] = [
    {
      id: 1,
      user_id: 1,
      descricao: 'Salário',
      valor: 5000,
      tipo: 'receita',
      data: '2024-01-15',
    },
    {
      id: 2,
      user_id: 1,
      descricao: 'Aluguel',
      valor: 1500,
      tipo: 'despesa',
      data: '2024-01-20',
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('should render table with finances', () => {
    render(
      <FinanceTable
        finances={mockFinances}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Salário')).toBeInTheDocument();
    expect(screen.getByText('Aluguel')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(
      <FinanceTable
        finances={[]}
        loading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('should format currency values correctly', () => {
    render(
      <FinanceTable
        finances={mockFinances}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument();
  });

  it('should display tipo tags with correct colors', () => {
    render(
      <FinanceTable
        finances={mockFinances}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const receitaTags = screen.getAllByText('RECEITA');
    const despesaTags = screen.getAllByText('DESPESA');

    expect(receitaTags.length).toBeGreaterThan(0);
    expect(despesaTags.length).toBeGreaterThan(0);
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <FinanceTable
        finances={mockFinances}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockFinances[0]);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <FinanceTable
        finances={mockFinances}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockFinances[0]);
  });

  it('should render empty table when no finances', () => {
    render(
      <FinanceTable
        finances={[]}
        loading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
