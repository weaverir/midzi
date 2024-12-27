"use client"
import React, { useEffect, useState } from 'react';
import axiosInstance from "@/lib/axios";

const Page = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('https://midzi.liara.run/accounts/orders/');
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleSetPending = async (orderId) => {
        try {
            await axiosInstance.patch(`https://midzi.liara.run/accounts/order/${orderId}/set-pending/`);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, payment_status: 'pending' } : order
            ));
            alert('وضعیت سفارش به در انتظار تغییر یافت');
        } catch (error) {
            console.error("Error setting order to pending:", error);
            alert('خطا در تغییر وضعیت سفارش');
        }
    };

    return (
        <div className="p-4 flex bg-navblue rounded-2xl dark:bg-navblueD dark:text-text_w font-sans_b flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">لیست سفارش‌ها</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.id} className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-4 p-6">
                        <h2 className="text-xl font-semibold mb-2">شناسه سفارش: {order.id}</h2>
                        <p className="mb-2">آدرس: {order.address.address}، {order.address.province}، {order.address.post_Code}</p>
                        <p className="mb-2">نوع تحویل: {order.delivery_type === 'normal' ? 'عادی' : order.delivery_type}</p>
                        <p className={`mb-2 ${order.is_sent ? 'text-green-500' : 'text-red-500'}`}>وضعیت: {order.is_sent ? 'ارسال شده' : 'ارسال نشده'}</p>
                        <p className="mb-2">وضعیت سفارش: {order.payment_status === 'pending' ? 'در انتظار' : order.payment_status}</p>
                        <p className="mb-2">تاریخ سفارش: {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">اقلام:</h3>
                            {order.items.map(item => (
                                <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                                    <p>محصول: {item.product_variant}</p>
                                    <p>تعداد: {item.quantity}</p>
                                    <p>قیمت: {item.price.toLocaleString()} تومان</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">قیمت کل:</h3>
                            <p>کل: {order.total_price.total_price.toLocaleString()} تومان</p>
                            <p>تخفیف‌دار: {order.total_price.discounted_price.toLocaleString()} تومان</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => handleSetPending(order.id)}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
                            >
                                تغییر وضعیت به در انتظار
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>سفارشی یافت نشد.</p>
            )}
        </div>
    );
};

export default Page;
