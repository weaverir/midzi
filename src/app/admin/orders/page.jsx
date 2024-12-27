"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

const Page = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);

    useEffect(() => {
        fetchOrderHistory();
        fetchCompletedOrders();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            const response = await axiosInstance.get('accounts/padmin/orders/');
            setOrderHistory(response.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    const fetchCompletedOrders = async () => {
        try {
            const response = await axiosInstance.get('accounts/padmin/orders/completed/');
            setCompletedOrders(response.data);
        } catch (error) {
            console.error('Error fetching completed orders:', error);
        }
    };

    const handleUpdateSentStatus = async (orderId) => {
        try {
            await axiosInstance.put(`accounts/order/${orderId}/update_sent/`, { is_sent: true });
            setOrderHistory(orderHistory.map(order =>
                order.id === orderId ? { ...order, is_sent: true } : order
            ));
            alert('وضعیت سفارش به "ارسال شده" تغییر یافت');
        } catch (error) {
            console.error("Error updating order status:", error);
            alert('خطا در تغییر وضعیت سفارش');
        }
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">تاریخچه سفارشات</h1>
            <h2 className="text-xl font-bold mb-4">سفارش‌های تکمیل شده</h2>
            <ul className="w-full max-w-4xl space-y-4">
                {completedOrders.map((order) => (
                    <li key={order.id} className="p-4 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-2">
                        <p><strong>سفارش شماره:</strong> {order.id}</p>
                        <p><strong>شناسه سبد:</strong> {order.basket}</p>
                        <p><strong>آدرس:</strong> {order.address.address}، {order.address.province}، {order.address.post_Code}</p>
                        <p><strong>نوع تحویل:</strong> {order.delivery_type === 'normal' ? 'عادی' : order.delivery_type}</p>
                        <p className={`mb-2 ${order.is_sent ? 'text-green-500' : 'text-red-500'}`}><strong>وضعیت:</strong> {order.is_sent ? 'ارسال شده' : 'ارسال نشده'}</p>
                        <p><strong>وضعیت پرداخت:</strong> {order.payment_status === 'pending' ? 'در انتظار' : order.payment_status}</p>
                        <p><strong>تاریخ سفارش:</strong> {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">اقلام:</h3>
                            {order.items.map(item => (
                                <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                                    <p><strong>محصول:</strong> {item.product_variant}</p>
                                    <p><strong>تعداد:</strong> {item.quantity}</p>
                                    <p><strong>قیمت:</strong> {item.price.toLocaleString()} تومان</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">قیمت کل:</h3>
                            <p><strong>کل:</strong> {order.total_price.total_price.toLocaleString()} تومان</p>
                            <p><strong>تخفیف‌دار:</strong> {order.total_price.discounted_price.toLocaleString()} تومان</p>
                        </div>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mb-4">سفارش‌های در حال انجام</h2>
            <ul className="w-full max-w-4xl space-y-4">
                {orderHistory.map((order) => (
                    <li key={order.id} className="p-4 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-2">
                        <p><strong>سفارش شماره:</strong> {order.id}</p>
                        <p><strong>شناسه سبد:</strong> {order.basket}</p>
                        <p><strong>آدرس:</strong> {order.address.address}، {order.address.province}، {order.address.post_Code}</p>
                        <p><strong>نوع تحویل:</strong> {order.delivery_type === 'normal' ? 'عادی' : order.delivery_type}</p>
                        <p className={`mb-2 ${order.is_sent ? 'text-green-500' : 'text-red-500'}`}><strong>وضعیت:</strong> {order.is_sent ? 'ارسال شده' : 'ارسال نشده'}</p>
                        <p><strong>وضعیت پرداخت:</strong> {order.payment_status === 'pending' ? 'در انتظار' : order.payment_status}</p>
                        <p><strong>تاریخ سفارش:</strong> {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">اقلام:</h3>
                            {order.items.map(item => (
                                <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                                    <p><strong>محصول:</strong> {item.product_variant}</p>
                                    <p><strong>تعداد:</strong> {item.quantity}</p>
                                    <p><strong>قیمت:</strong> {item.price.toLocaleString()} تومان</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">قیمت کل:</h3>
                            <p><strong>کل:</strong> {order.total_price.total_price.toLocaleString()} تومان</p>
                            <p><strong>تخفیف‌دار:</strong> {order.total_price.discounted_price.toLocaleString()} تومان</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => handleUpdateSentStatus(order.id)}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
                            >
                                تغییر وضعیت به ارسال شده
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Page;
