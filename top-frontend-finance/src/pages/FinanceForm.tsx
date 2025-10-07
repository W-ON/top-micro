import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Select, Button, Space, Typography } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FinanceFormData } from '../types/finance';
import { financeSchema } from '../schemas/financeSchema';
import { useFinances, useFinance } from '../hooks/useFinances';

const { Title } = Typography;

export const FinanceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: finance } = useFinance(Number(id));
  const { createFinance, updateFinance, isCreating, isUpdating } = useFinances();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinanceFormData>({
    resolver: yupResolver(financeSchema),
    defaultValues: {
      user_id: 0,
      descricao: '',
      valor: 0,
      tipo: 'receita',
      data: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (finance) {
      reset({
        user_id: finance.user_id,
        descricao: finance.descricao,
        valor: finance.valor,
        tipo: finance.tipo,
        data: finance.data,
      });
    }
  }, [finance, reset]);

  const onSubmit = (data: FinanceFormData) => {
    if (isEditing && id) {
      updateFinance(
        { id: Number(id), data },
        {
          onSuccess: () => {
            navigate('/');
          },
        }
      );
    } else {
      createFinance(data, {
        onSuccess: () => {
          navigate('/');
        },
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ marginBottom: 16 }}
          >
            Voltar
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            {isEditing ? 'Editar Finança' : 'Nova Finança'}
          </Title>
        </div>

        <Card>
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label="Usuário"
              validateStatus={errors.user_id ? 'error' : ''}
              help={errors.user_id?.message}
              required
            >
              <Controller
                name="user_id"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: '100%' }}
                    placeholder="ID do usuário"
                    min={1}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Descrição"
              validateStatus={errors.descricao ? 'error' : ''}
              help={errors.descricao?.message}
              required
            >
              <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Descrição da finança"
                    rows={3}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Tipo"
              validateStatus={errors.tipo ? 'error' : ''}
              help={errors.tipo?.message}
              required
            >
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select {...field} placeholder="Selecione o tipo">
                    <Select.Option value="receita">Receita</Select.Option>
                    <Select.Option value="despesa">Despesa</Select.Option>
                  </Select>
                )}
              />
            </Form.Item>

            <Form.Item
              label="Valor"
              validateStatus={errors.valor ? 'error' : ''}
              help={errors.valor?.message}
              required
            >
              <Controller
                name="valor"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    style={{ width: '100%' }}
                    placeholder="0.00"
                    min={0.01}
                    step={0.01}
                    precision={2}
                    formatter={(value) =>
                      `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                    parser={(value) =>
                      value?.replace(/R\$\s?|(\.*)/g, '').replace(',', '.') as any
                    }
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Data"
              validateStatus={errors.data ? 'error' : ''}
              help={errors.data?.message}
              required
            >
              <Controller
                name="data"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    style={{ width: '100%' }}
                  />
                )}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isSubmitting}
                >
                  {isEditing ? 'Atualizar' : 'Criar'}
                </Button>
                <Button onClick={() => navigate('/')}>Cancelar</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};
