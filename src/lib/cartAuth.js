import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCartItemCount = async () => {
        const basketId = localStorage.getItem('basket');
        if (!basketId) return;

        try {
            const response = await axiosInstance.get(`/accounts/basket/${basketId}/items/`);
            setCartItemCount(response.data.basket.items.length);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItemCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartItemCount, setCartItemCount, fetchCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
