import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { Finance, FinanceSummary as Summary } from '../types/finance';
import { formatCurrency } from '../utils/formatCurrency';

interface FinanceSummaryProps {
  finances: Finance[];
}

export const FinanceSummary: React.FC<FinanceSummaryProps> = ({ finances }) => {
  const summary: Summary = React.useMemo(() => {
    const receitas = finances
      .filter((f) => f.tipo === 'receita')
      .reduce((acc, f) => acc + f.valor, 0);

    const despesas = finances
      .filter((f) => f.tipo === 'despesa')
      .reduce((acc, f) => acc + f.valor, 0);

    return {
      receitas,
      despesas,
      total: receitas - despesas,
    };
  }, [finances]);

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Saldo Total"
            value={summary.total}
            precision={2}
            prefix={<DollarOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: summary.total >= 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Receitas"
            value={summary.receitas}
            precision={2}
            prefix={<RiseOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Despesas"
            value={summary.despesas}
            precision={2}
            prefix={<FallOutlined />}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};
