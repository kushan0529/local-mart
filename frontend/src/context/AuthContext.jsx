import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        error: null 
      };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload, user: null, token: null };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    try {
      const { data } = await API.get('/auth/me');
      // Normalize user data: backend returns success:true and user fields at top level or in data.user
      const userData = data.user || data;
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: userData, token } });
    } catch (err) {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Session expired' });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      // Backend login returns user fields and token at top level
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: data, token: data.token } });
      return data;
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Login failed' });
      throw err;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await API.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: data, token: data.token } });
      return data;
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Registration failed' });
      throw err;
    }
  };

  const registerOwner = async (ownerData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await API.post('/auth/register-owner', ownerData);
      // Note: Owner might not be approved yet, but we store the token/user for now
      localStorage.setItem('token', data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: data, token: data.token } });
      return data;
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.response?.data?.message || 'Registration failed' });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, registerOwner, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
