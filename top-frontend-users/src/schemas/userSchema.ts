import * as yup from 'yup';

// Validação de CPF
const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Validação de telefone brasileiro
const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;

export const userSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  email: yup
    .string()
    .required('E-mail é obrigatório')
    .email('E-mail inválido')
    .max(100, 'E-mail deve ter no máximo 100 caracteres'),

  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .test('valid-cpf', 'CPF inválido', (value) => {
      if (!value) return false;
      return validateCPF(value);
    }),

  phone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(phoneRegex, 'Formato de telefone inválido. Use: (XX) XXXXX-XXXX'),

  address: yup
    .string()
    .required('Endereço é obrigatório')
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres'),
});

export type UserFormData = yup.InferType<typeof userSchema>;
