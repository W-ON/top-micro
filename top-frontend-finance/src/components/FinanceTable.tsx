import React from 'react';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Finance } from '../types/finance';
import { formatCurrency } from '../utils/formatCurrency';

interface FinanceTableProps {
  finances: Finance[];
  loading: boolean;
  onEdit: (finance: Finance) => void;
  onDelete: (finance: Finance) => void;
}

export const FinanceTable: React.FC<FinanceTableProps> = ({
  finances,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<Finance> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Usuário',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      ellipsis: true,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 120,
      render: (tipo: string) => (
        <Tag color={tipo === 'receita' ? 'green' : 'red'}>
          {tipo.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      width: 150,
      render: (valor: number, record: Finance) => (
        <span style={{ color: record.tipo === 'receita' ? '#3f8600' : '#cf1322' }}>
          {formatCurrency(valor)}
        </span>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      width: 120,
      render: (data: string) => new Date(data).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_: any, record: Finance) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={finances}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total de ${total} registros`,
      }}
      scroll={{ x: 800 }}
    />
  );
};
