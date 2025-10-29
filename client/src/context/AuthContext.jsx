import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const getStoredToken = () =>
  (typeof window !== 'undefined' && (localStorage.getItem('token') || sessionStorage.getItem('token'))) || null;

const AuthContext = createContext();

const initialState = {
  token: getStoredToken(),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS': {
      // Clear existing tokens, then store based on remember flag (defaults to session)
      try {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
      } catch {}
      if (action.remember) {
        localStorage.setItem('token', action.payload.token);
      } else {
        sessionStorage.setItem('token', action.payload.token);
      }
      try {
        const u = JSON.stringify(action.payload.user);
        if (action.remember) {
          localStorage.setItem('auth_user', u);
        } else {
          sessionStorage.setItem('auth_user', u);
        }
      } catch {}
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        error: null
      };
    }
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      try {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } catch {}
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios header
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete api.defaults.headers.common['x-auth-token'];
    }
  };

  // Load user
  const loadUser = async () => {
    const token = getStoredToken();
    if (token) {
      setAuthToken(token);
    }

    try {
      const res = await api.get('/api/auth/user');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data?.message || 'Authentication failed'
      });
    }
  };

  // Register user
  const register = async (formData, remember = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const payload = { ...formData };
      delete payload.confirmPassword; // Not required by backend

      const res = await api.post('/api/auth/register', payload);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
        remember
      });

      setAuthToken(res.data.token);

      return { success: true };
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const message =
        error.response?.data?.message ||
        validationErrors?.[0]?.msg ||
        'Registration failed';

      dispatch({
        type: 'REGISTER_FAIL',
        payload: message
      });

      return { success: false, message, errors: validationErrors };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login user
  const login = async (formData, remember = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/api/auth/login', formData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
        remember
      });

      setAuthToken(res.data.token);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAIL',
        payload: message
      });
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  useEffect(() => {
    // Only run once on mount. If a token exists in either storage, set header and load user.
    const token = (typeof window !== 'undefined') && (localStorage.getItem('token') || sessionStorage.getItem('token'));
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};