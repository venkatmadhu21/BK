import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AdminRoute from './AdminRoute';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  loading: false
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => <div>{children}</div>
}));

const TestComponent = () => <div>Admin Content</div>;

describe('AdminRoute', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    mockAuthContext.loading = false;
  });

  test('renders children when user is admin', () => {
    mockAuthContext.user = { isAdmin: true, email: 'admin@example.com' };
    mockAuthContext.isAuthenticated = true;

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('renders children when user has admin role', () => {
    mockAuthContext.user = { role: 'admin', email: 'admin@example.com' };
    mockAuthContext.isAuthenticated = true;

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('does not render children when user is not admin', () => {
    mockAuthContext.user = { email: 'user@example.com' };
    mockAuthContext.isAuthenticated = true;

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('does not render children when user is not authenticated', () => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('shows access denied message for non-admin users', () => {
    mockAuthContext.user = { email: 'user@example.com' };
    mockAuthContext.isAuthenticated = true;

    render(
      <BrowserRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});