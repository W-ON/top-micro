import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../services/financeApi';
import { FinanceFormData } from '../types/finance';
import { message } from 'antd';

export const useFinances = (userId?: number) => {
  const queryClient = useQueryClient();

  const financesQuery = useQuery({
    queryKey: userId ? ['finances', 'user', userId] : ['finances'],
    queryFn: () => (userId ? financeApi.getByUserId(userId) : financeApi.getAll()),
  });

  const createMutation = useMutation({
    mutationFn: (data: FinanceFormData) => financeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      message.success('Finança criada com sucesso!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erro ao criar finança');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FinanceFormData }) =>
      financeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      message.success('Finança atualizada com sucesso!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erro ao atualizar finança');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => financeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      message.success('Finança excluída com sucesso!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Erro ao excluir finança');
    },
  });

  return {
    finances: financesQuery.data || [],
    isLoading: financesQuery.isLoading,
    error: financesQuery.error,
    createFinance: createMutation.mutate,
    updateFinance: updateMutation.mutate,
    deleteFinance: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useFinance = (id: number) => {
  return useQuery({
    queryKey: ['finance', id],
    queryFn: () => financeApi.getById(id),
    enabled: !!id,
  });
};
