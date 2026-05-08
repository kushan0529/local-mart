import React, { createContext, useContext, useReducer, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  cart: { items: [] },
  loading: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false };
    case 'CART_START':
      return { ...state, loading: true };
    case 'CART_ERROR':
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchCart();
    } else {
      // Local storage cart for guests
      const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
      dispatch({ type: 'SET_CART', payload: localCart });
    }
  }, [user]);

  const fetchCart = async () => {
    dispatch({ type: 'CART_START' });
    try {
      const { data } = await API.get('/cart');
      dispatch({ type: 'SET_CART', payload: data.data });
    } catch (err) {
      dispatch({ type: 'CART_ERROR' });
    }
  };

  const addToCart = async (productId, qty = 1) => {
    if (user && user.role === 'user') {
      try {
        const { data } = await API.post('/cart/add', { productId, qty });
        dispatch({ type: 'SET_CART', payload: data.data });
      } catch (err) {
        console.error(err);
      }
    } else {
      // Logic for guest cart
      let localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
      const itemIndex = localCart.items.findIndex(item => item.product._id === productId);
      // Need product details for guest cart, usually fetched before calling this
      // For simplicity, we'll assume product object is passed or fetched
    }
  };

  const updateQty = async (productId, qty) => {
    if (user && user.role === 'user') {
      try {
        const { data } = await API.put('/cart/update', { productId, qty });
        dispatch({ type: 'SET_CART', payload: data.data });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (user && user.role === 'user') {
      try {
        const { data } = await API.delete(`/cart/remove/${productId}`);
        dispatch({ type: 'SET_CART', payload: data.data });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearCart = async () => {
    if (user && user.role === 'user') {
      try {
        await API.delete('/cart/clear');
        dispatch({ type: 'SET_CART', payload: { items: [] } });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, updateQty, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
