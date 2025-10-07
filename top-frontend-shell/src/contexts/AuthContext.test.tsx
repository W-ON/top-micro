import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Test component that uses the auth context
const TestComponent: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      {user && <div data-testid="user-name">{user.name}</div>}
      <button
        onClick={() => login({ username: 'admin', password: 'admin123' })}
        data-testid="login-button"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render with initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  it('should authenticate user with valid credentials', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Admin User');
    });
  });

  it('should logout user and clear state', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    const loginButton = screen.getByTestId('login-button');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Then logout
    const logoutButton = screen.getByTestId('logout-button');
    await user.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    });
  });

  it('should persist user in localStorage on login', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByTestId('login-button');
    await user.click(loginButton);

    await waitFor(() => {
      const storedUser = localStorage.getItem('user');
      expect(storedUser).toBeTruthy();
      const parsedUser = JSON.parse(storedUser!);
      expect(parsedUser.username).toBe('admin');
    });
  });

  it('should clear localStorage on logout', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login
    await user.click(screen.getByTestId('login-button'));
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeTruthy();
    });

    // Logout
    await user.click(screen.getByTestId('logout-button'));
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });
});
