import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Finance } from '../types/finance';
import { formatCurrency } from '../utils/formatCurrency';

interface DeleteFinanceModalProps {
  finance: Finance | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const DeleteFinanceModal: React.FC<DeleteFinanceModalProps> = ({
  finance,
  open,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!finance) return null;

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          Confirmar Exclusão
        </span>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Confirmar"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
    >
      <p>Tem certeza que deseja excluir esta finança?</p>
      <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
        <p style={{ margin: 0 }}>
          <strong>Descrição:</strong> {finance.descricao}
        </p>
        <p style={{ margin: '8px 0 0 0' }}>
          <strong>Valor:</strong> {formatCurrency(finance.valor)}
        </p>
        <p style={{ margin: '8px 0 0 0' }}>
          <strong>Tipo:</strong> {finance.tipo}
        </p>
      </div>
    </Modal>
  );
};
