import React, { useState } from 'react';
import { Button, Space, Select, Typography, Row, Col } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { Finance } from '../types/finance';
import { useFinances } from '../hooks/useFinances';
import { FinanceTable } from '../components/FinanceTable';
import { FinanceSummary } from '../components/FinanceSummary';
import { DeleteFinanceModal } from '../components/DeleteFinanceModal';

const { Title } = Typography;

export const FinanceList: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [financeToDelete, setFinanceToDelete] = useState<Finance | null>(null);

  const { finances, isLoading, deleteFinance, isDeleting } = useFinances(selectedUserId);

  const handleEdit = (finance: Finance) => {
    console.log('Editar finança:', finance);
    // Navegação será implementada pelo shell application
  };

  const handleDelete = (finance: Finance) => {
    setFinanceToDelete(finance);
  };

  const handleConfirmDelete = () => {
    if (financeToDelete?.id) {
      deleteFinance(financeToDelete.id, {
        onSuccess: () => {
          setFinanceToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setFinanceToDelete(null);
  };

  const uniqueUserIds = Array.from(new Set(finances.map((f) => f.user_id))).sort(
    (a, b) => a - b
  );

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Finanças
          </Title>
        </Col>
        <Col>
          <Space>
            <Select
              placeholder="Filtrar por usuário"
              allowClear
              style={{ width: 200 }}
              value={selectedUserId}
              onChange={setSelectedUserId}
              suffixIcon={<FilterOutlined />}
            >
              {uniqueUserIds.map((userId) => (
                <Select.Option key={userId} value={userId}>
                  Usuário {userId}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => console.log('Criar nova finança')}
            >
              Nova Finança
            </Button>
          </Space>
        </Col>
      </Row>

      <FinanceSummary finances={finances} />

      <FinanceTable
        finances={finances}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteFinanceModal
        finance={financeToDelete}
        open={!!financeToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={isDeleting}
      />
    </div>
  );
};
