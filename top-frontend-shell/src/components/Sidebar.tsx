import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem 0;
  min-height: calc(100vh - 73px);
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.75rem 1.5rem;
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  border-left: 3px solid transparent;

  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
  }

  &.active {
    background-color: #e0f2fe;
    color: #0369a1;
    border-left-color: #0369a1;
  }
`;

const SectionTitle = styled.div`
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 1rem;

  &:first-child {
    margin-top: 0;
  }
`;

export const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Nav>
        <SectionTitle>Dashboard</SectionTitle>
        <StyledNavLink to="/dashboard">Overview</StyledNavLink>

        <SectionTitle>Modules</SectionTitle>
        <StyledNavLink to="/dashboard/users">Users Management</StyledNavLink>
        <StyledNavLink to="/dashboard/finance">Finance Module</StyledNavLink>
      </Nav>
    </SidebarContainer>
  );
};
