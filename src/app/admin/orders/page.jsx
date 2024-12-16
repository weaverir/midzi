"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

const Page = () => {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            const response = await axiosInstance.get('padmin/OrderHistoryAdminView/');
            setOrderHistory(response.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">تاریخچه سفارشات</h1>
            <ul>
                {orderHistory.map((order) => (
                    <li key={order.id} className="p-4 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-2">
                        <p><strong>سفارش شماره:</strong> {order.id}</p>
                        <p><strong>مشتری:</strong> {order.customer_name}</p>
                        <p><strong>تاریخ:</strong> {new Date(order.date).toLocaleString()}</p>
                        <p><strong>مبلغ:</strong> {order.amount}</p>
                        <p><strong>وضعیت:</strong> {order.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Page;
