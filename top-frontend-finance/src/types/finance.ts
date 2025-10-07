export interface Finance {
  id?: number;
  user_id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceFormData {
  user_id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
}

export interface FinanceSummary {
  total: number;
  receitas: number;
  despesas: number;
}
