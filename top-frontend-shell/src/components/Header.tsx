import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: #1e293b;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  color: #e2e8f0;
`;

const LogoutButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }

  &:active {
    background-color: #b91c1c;
  }
`;

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <HeaderContainer>
      <Title>Microfrontend Shell</Title>
      <UserInfo>
        <UserName>{user?.name || user?.username}</UserName>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </UserInfo>
    </HeaderContainer>
  );
};
