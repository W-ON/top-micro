import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import type { User } from '../types/user';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Carregando usuários...</Typography>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Nenhum usuário encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Nome
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Contato
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Endereço
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Status
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              Criado em
            </TableCell>
            <TableCell
              align="center"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontWeight="medium">
                  {user.nome}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HomeIcon fontSize="small" color="action" />
                  <Typography variant="body2" noWrap maxWidth={200}>
                    {user.cidade}, {user.estado}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={user.status}
                  size="small"
                  color={user.status === 'ativo' ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(user.created)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip key={`edit-${user.id}`} title="Editar">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(user)}
                      aria-label={`editar ${user.nome}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip key={`delete-${user.id}`} title="Excluir">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(user)}
                      aria-label={`excluir ${user.nome}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
