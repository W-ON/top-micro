import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Alert,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { UserTable } from '../components/UserTable';
import { DeleteUserModal } from '../components/DeleteUserModal';
import { useUsers, useDeleteUser } from '../hooks/useUsers';
import type { User } from '../types/user';

export const UsersList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset para primeira página ao buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, error, refetch } = useUsers({
    page,
    limit,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteUser();

  const handleEdit = (user: User) => {
    console.log('Editar usuário:', user);
    // Navegação será implementada pelo shell application
  };

  const handleDeleteClick = (user: User) => {
    setDeleteUser(user);
  };

  const handleDeleteConfirm = async () => {
    if (deleteUser) {
      try {
        await deleteMutation.mutateAsync(deleteUser.id);
        setDeleteUser(null);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Erro ao carregar usuários: {error?.message || 'Erro desconhecido'}
        </Alert>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          sx={{ mt: 2 }}
        >
          Tentar Novamente
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gerenciamento de Usuários
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize, edite e gerencie os usuários do sistema
        </Typography>
      </Box>

      {/* Filtros e Ações */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            fullWidth
            placeholder="Buscar por nome, email ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="limit-select-label">Por página</InputLabel>
            <Select
              labelId="limit-select-label"
              value={limit}
              label="Por página"
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => console.log('Criar novo usuário')}
            sx={{ minWidth: 150 }}
          >
            Novo Usuário
          </Button>
        </Stack>
      </Paper>

      {/* Mensagens de Sucesso */}
      {deleteMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Usuário excluído com sucesso!
        </Alert>
      )}

      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao excluir usuário. Tente novamente.
        </Alert>
      )}

      {/* Tabela */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <UserTable
            users={data?.data || []}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={isLoading}
          />

          {/* Paginação */}
          {data && data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Info de Paginação */}
          {data && data.total > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              Mostrando {(page - 1) * limit + 1} a{' '}
              {Math.min(page * limit, data.total)} de {data.total} usuários
            </Typography>
          )}
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <DeleteUserModal
        open={!!deleteUser}
        user={deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </Container>
  );
};
