import * as yup from 'yup';

export const financeSchema = yup.object().shape({
  user_id: yup
    .number()
    .required('Usuário é obrigatório')
    .positive('Selecione um usuário válido')
    .integer('Selecione um usuário válido'),
  descricao: yup
    .string()
    .required('Descrição é obrigatória')
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(255, 'Descrição deve ter no máximo 255 caracteres'),
  valor: yup
    .number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser maior que zero')
    .typeError('Valor deve ser um número válido'),
  tipo: yup
    .string()
    .required('Tipo é obrigatório')
    .oneOf(['receita', 'despesa'], 'Tipo deve ser receita ou despesa'),
  data: yup
    .string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
});
