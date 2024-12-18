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
            <ul className="space-y-4">
                {orderHistory.map((order) => (
                    <li key={order.id} className="p-4 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-2">
                        <p><strong>سفارش شماره:</strong> {order.id}</p>
                        <p><strong>مشتری:</strong> {order.customer_name}</p>
                        <p><strong>شماره تماس:</strong> {order.phone_number}</p>
                        {order.items.map((item) => (
                            <div key={item.id} className="p-2 mt-2 border-t dark:border-gray-600">
                                <p><strong>نام محصول:</strong> {item.product.name}</p>
                                <p><strong>توضیحات محصول:</strong> {item.product.description}</p>
                                <p><strong>تعداد:</strong> {item.quantity}</p>
                                <p><strong>قیمت:</strong> {item.price.toLocaleString()} تومان</p>
                                <p><strong>جمع کل:</strong> {item.total_price.toLocaleString()} تومان</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <p><strong>رنگ:</strong> {item.product_variant.color.name}</p>
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.product_variant.color.hex_code }}></div>
                                </div>
                                <p><strong>سایز:</strong> {item.product_variant.size.name}</p>
                                <div className="flex justify-center mt-4">
                                    <img
                                        src={`https://midzi.liara.run${item.thumbnail}`}
                                        alt={item.product.name}
                                        className="object-cover w-24 h-24 rounded"
                                    />
                                </div>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Page;
