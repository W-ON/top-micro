import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import React from 'react';

const ProtectedContent: React.FC = () => <div>Protected Content</div>;
const LoginPage: React.FC = () => <div>Login Page</div>;

const renderWithRouter = (isAuthenticated: boolean) => {
  // Mock localStorage
  if (isAuthenticated) {
    localStorage.setItem(
      'user',
      JSON.stringify({ id: '1', username: 'test', name: 'Test User', email: 'test@example.com' })
    );
    localStorage.setItem('authToken', 'mock-token-1');
  } else {
    localStorage.clear();
  }

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render protected content when authenticated', () => {
    renderWithRouter(true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    renderWithRouter(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to "/" when user is not authenticated', () => {
    const { container } = renderWithRouter(false);
    // Check that we're on the login page (root route)
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
