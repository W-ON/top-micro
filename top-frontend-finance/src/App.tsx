import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { FinanceList } from './pages/FinanceList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ptBR}>
      <QueryClientProvider client={queryClient}>
        <FinanceList />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
