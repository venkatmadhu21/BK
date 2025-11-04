import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FamilyTree from './FamilyTree';

// Mock the AuthContext
const mockAuthContext = {
  user: null
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock API
jest.mock('../../utils/api', () => ({
  get: jest.fn()
}));

// Mock react-router-dom hooks
const mockParams = { serNo: null };
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}));

// Mock family tree components
jest.mock('./GraphicalFamilyTree', () => () => <div>GraphicalFamilyTree</div>);
jest.mock('./VerticalFamilyTree', () => () => <div>VerticalFamilyTree</div>);
jest.mock('./ModernFamilyTree', () => () => <div>ModernFamilyTree</div>);
jest.mock('./CardFamilyTree', () => () => <div>CardFamilyTree</div>);
jest.mock('./EnhancedFamilyTree', () => () => <div>EnhancedFamilyTree</div>);
jest.mock('./ComprehensiveFamilyTree', () => () => <div>ComprehensiveFamilyTree</div>);
jest.mock('./InteractiveFamilyTree', () => () => <div>InteractiveFamilyTree</div>);
jest.mock('./FamilyTreePDFExport', () => () => <div>FamilyTreePDFExport</div>);

describe('FamilyTree Role-Based Views', () => {
  beforeEach(() => {
    mockAuthContext.user = null;
    mockParams.serNo = null;
  });

  test('shows only horizontal view for regular users', () => {
    mockAuthContext.user = { email: 'user@example.com' };

    render(
      <BrowserRouter>
        <FamilyTree />
      </BrowserRouter>
    );

    // Should only show the interactive family tree for regular users
    expect(screen.getByText('Interactive Family Tree')).toBeInTheDocument();
    expect(screen.queryByText('React D3 Tree (Couples)')).not.toBeInTheDocument();
    expect(screen.queryByText('Visual Tree with Relationships')).not.toBeInTheDocument();
  });

  test('shows all views for admin users', () => {
    mockAuthContext.user = { isAdmin: true, email: 'admin@example.com' };

    render(
      <BrowserRouter>
        <FamilyTree />
      </BrowserRouter>
    );

    // Should show all view buttons for admin
    expect(screen.getByText('React D3 Tree (Couples)')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Tree')).toBeInTheDocument();
    expect(screen.getByText('Collapsible Tree')).toBeInTheDocument();
    expect(screen.getByText('Horizontal Tree')).toBeInTheDocument();
    expect(screen.getByText('Text View')).toBeInTheDocument();
    expect(screen.queryByText('Visual Tree with Relationships')).not.toBeInTheDocument();
  });

  test('shows all views for users with admin role', () => {
    mockAuthContext.user = { role: 'admin', email: 'admin@example.com' };

    render(
      <BrowserRouter>
        <FamilyTree />
      </BrowserRouter>
    );

    // Should show all view buttons for admin role
    expect(screen.getByText('React D3 Tree (Couples)')).toBeInTheDocument();
    expect(screen.getByText('Enhanced Tree')).toBeInTheDocument();
    expect(screen.getByText('Collapsible Tree')).toBeInTheDocument();
  });

  test('defaults to interactive family tree for regular users', () => {
    mockAuthContext.user = { email: 'user@example.com' };

    render(
      <BrowserRouter>
        <FamilyTree />
      </BrowserRouter>
    );

    // The interactive family tree button should be active (blue background)
    const button = screen.getByText('Interactive Family Tree');
    expect(button).toHaveClass('bg-blue-600');
  });

  test('defaults to react d3 view for admins without specific member', () => {
    mockAuthContext.user = { isAdmin: true, email: 'admin@example.com' };
    mockParams.serNo = null;

    render(
      <BrowserRouter>
        <FamilyTree />
      </BrowserRouter>
    );

    // The React D3 button should be active for admins without specific member
    const d3Button = screen.getByText('React D3 Tree (Couples)');
    expect(d3Button).toHaveClass('bg-blue-600');
  });
});