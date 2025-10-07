import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import type { User } from '../types/user';

interface DeleteUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-user-dialog-title"
    >
      <DialogTitle id="delete-user-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6">Confirmar Exclusão</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Esta ação não pode ser desfeita!
        </Alert>
        <Typography variant="body1" gutterBottom>
          Você tem certeza que deseja excluir o usuário:
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: 'grey.100',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Nome:
          </Typography>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            E-mail:
          </Typography>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CPF:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {user.cpf}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          autoFocus
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
