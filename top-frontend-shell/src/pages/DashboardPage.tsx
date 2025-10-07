import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

const DashboardLayout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: #ffffff;
  overflow-y: auto;
`;

const WelcomeSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Header />
      <MainContent>
        <Sidebar />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </DashboardLayout>
  );
};

export const DashboardHome: React.FC = () => {
  return (
    <WelcomeSection>
      <WelcomeTitle>Dashboard Overview</WelcomeTitle>
      <WelcomeText>
        Welcome to the Microfrontend Shell application. This is the main dashboard
        that integrates multiple microfrontend modules using Module Federation.
      </WelcomeText>

      <CardGrid>
        <Card>
          <CardIcon>👥</CardIcon>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>
            Manage users, view user details, and perform CRUD operations. This module
            is loaded dynamically from a remote microfrontend.
          </CardDescription>
        </Card>

        <Card>
          <CardIcon>💰</CardIcon>
          <CardTitle>Finance Module</CardTitle>
          <CardDescription>
            Access financial data, view transactions, and manage financial operations.
            This module is also loaded dynamically via Module Federation.
          </CardDescription>
        </Card>

        <Card>
          <CardIcon>🔧</CardIcon>
          <CardTitle>Module Federation</CardTitle>
          <CardDescription>
            All modules are integrated using Vite's Module Federation plugin,
            allowing for independent deployment and development.
          </CardDescription>
        </Card>
      </CardGrid>
    </WelcomeSection>
  );
};
