import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinanceSummary } from './FinanceSummary';
import { Finance } from '../types/finance';

describe('FinanceSummary', () => {
  it('should calculate and display correct totals', () => {
    const finances: Finance[] = [
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
      {
        id: 3,
        user_id: 1,
        descricao: 'Freelance',
        valor: 2000,
        tipo: 'receita',
        data: '2024-01-25',
      },
    ];

    render(<FinanceSummary finances={finances} />);

    // Total = 5000 + 2000 - 1500 = 5500
    expect(screen.getByText('R$ 5.500,00')).toBeInTheDocument();
    // Receitas = 5000 + 2000 = 7000
    expect(screen.getByText('R$ 7.000,00')).toBeInTheDocument();
    // Despesas = 1500
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument();
  });

  it('should display zero values when no finances', () => {
    render(<FinanceSummary finances={[]} />);

    const zeroValues = screen.getAllByText('R$ 0,00');
    expect(zeroValues).toHaveLength(3);
  });

  it('should display negative total when despesas > receitas', () => {
    const finances: Finance[] = [
      {
        id: 1,
        user_id: 1,
        descricao: 'Salário',
        valor: 1000,
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

    render(<FinanceSummary finances={finances} />);

    // Total = 1000 - 1500 = -500
    expect(screen.getByText('-R$ 500,00')).toBeInTheDocument();
  });

  it('should render all summary cards', () => {
    const finances: Finance[] = [
      {
        id: 1,
        user_id: 1,
        descricao: 'Salário',
        valor: 5000,
        tipo: 'receita',
        data: '2024-01-15',
      },
    ];

    render(<FinanceSummary finances={finances} />);

    expect(screen.getByText('Saldo Total')).toBeInTheDocument();
    expect(screen.getByText('Receitas')).toBeInTheDocument();
    expect(screen.getByText('Despesas')).toBeInTheDocument();
  });

  it('should handle only receitas', () => {
    const finances: Finance[] = [
      {
        id: 1,
        user_id: 1,
        descricao: 'Salário',
        valor: 3000,
        tipo: 'receita',
        data: '2024-01-15',
      },
      {
        id: 2,
        user_id: 1,
        descricao: 'Bonus',
        valor: 1000,
        tipo: 'receita',
        data: '2024-01-20',
      },
    ];

    render(<FinanceSummary finances={finances} />);

    expect(screen.getByText('R$ 4.000,00')).toBeInTheDocument(); // Total
  });

  it('should handle only despesas', () => {
    const finances: Finance[] = [
      {
        id: 1,
        user_id: 1,
        descricao: 'Aluguel',
        valor: 1000,
        tipo: 'despesa',
        data: '2024-01-15',
      },
      {
        id: 2,
        user_id: 1,
        descricao: 'Contas',
        valor: 500,
        tipo: 'despesa',
        data: '2024-01-20',
      },
    ];

    render(<FinanceSummary finances={finances} />);

    expect(screen.getByText('-R$ 1.500,00')).toBeInTheDocument(); // Total
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument(); // Despesas
  });
});
