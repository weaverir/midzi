"use client";
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get("/accounts/dashboard/");
                setInfo(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <UserContext.Provider value={{ info }}>
            {children}
        </UserContext.Provider>
    );
};
