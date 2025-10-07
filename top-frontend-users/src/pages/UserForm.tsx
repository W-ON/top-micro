import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { userSchema, type UserFormData } from '../schemas/userSchema';
import { useUser, useCreateUser, useUpdateUser } from '../hooks/useUsers';

export const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: user, isLoading: isLoadingUser } = useUser(id || '');
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      address: '',
    },
  });

  // Preenche o formulário quando estiver editando
  useEffect(() => {
    if (user && isEditing) {
      reset({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user, isEditing, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const isLoading = isLoadingUser || createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  if (isLoadingUser && isEditing) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditing
            ? 'Atualize os dados do usuário'
            : 'Preencha os dados do novo usuário'}
        </Typography>
      </Box>

      {/* Mensagens de Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao salvar usuário. Verifique os dados e tente novamente.
        </Alert>
      )}

      {/* Formulário */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome Completo"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="E-mail"
                  type="email"
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="CPF"
                  fullWidth
                  required
                  placeholder="000.000.000-00"
                  error={!!errors.cpf}
                  helperText={errors.cpf?.message}
                  disabled={isLoading}
                  inputProps={{ maxLength: 14 }}
                  onChange={(e) => {
                    // Formata CPF enquanto digita
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      value = value.replace(/(\d{3})(\d)/, '$1.$2');
                      value = value.replace(/(\d{3})(\d)/, '$1.$2');
                      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    }
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Telefone"
                  fullWidth
                  required
                  placeholder="(00) 00000-0000"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isLoading}
                  inputProps={{ maxLength: 15 }}
                  onChange={(e) => {
                    // Formata telefone enquanto digita
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      value = value.replace(/(\d{2})(\d)/, '($1) $2');
                      value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                    field.onChange(value);
                  }}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Endereço"
                  fullWidth
                  required
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={isLoading}
                size="large"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isLoading || !isDirty}
                size="large"
              >
                {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
