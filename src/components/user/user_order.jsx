"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

const Countdown = ({ initialTime }) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        let intervalId;
        if (time > 0) {
            intervalId = setInterval(() => {
                setTime(time => time - 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [time]);

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days} روز, ${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="reservation-time bg-yellow-200 rounded-xl p-2 text-black">
            زمان باقی مانده: {formatTime(time)}
        </div>
    );
};

const UserOrder = () => {
    const [orders, setOrders] = useState({ completed_orders: [], reserved_orders: [] });
    const [selectedTab, setSelectedTab] = useState('all');

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
            toast.success('وضعیت سفارش به در انتظار تغییر یافت');
        } catch (error) {
            console.error("Error setting order to pending:", error);
            toast.error('خطا در تغییر وضعیت سفارش');
        }
    };

    const parseRemainingTime = (timeString) => {
        if (timeString === "No reservation") return 0;
        const [days, timeWithMillis] = timeString.split(', ');
        const time = timeWithMillis.split('.')[0];
        const [hours, mins, secs] = time.split(':').map(Number);
        const totalSeconds = (Number(days.split(' ')[0]) * 86400) + (hours * 3600) + (mins * 60) + secs;
        return totalSeconds;
    };

    const getFilteredOrders = () => {
        if (selectedTab === 'reserved') return orders.reserved_orders;
        if (selectedTab === 'completed') return orders.completed_orders;
        return [...orders.completed_orders, ...orders.reserved_orders];
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className="p-4 flex bg-navblue rounded-2xl dark:bg-navblueD dark:text-text_w font-sans_b flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">لیست سفارش‌ها</h1>
            <div className="mb-4 flex rounded text-black gap-3">
                <button onClick={() => setSelectedTab('all')} className={`py-2 px-4 ${selectedTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}>همه سفارش‌ها</button>
                <button onClick={() => setSelectedTab('reserved')} className={`py-2 px-4 ${selectedTab === 'reserved' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}>رزرو ها</button>
                <button onClick={() => setSelectedTab('completed')} className={`py-2 px-4 ${selectedTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}>سفارش‌های تکمیل شده</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <div key={order.id} className="w-full bg-white dark:bg-bgdark rounded-lg shadow-lg mb-4 p-6">
                            <h2 className="text-xl font-semibold mb-2">شناسه سفارش: {order.id}</h2>
                            <p className="mb-2">آدرس: {order.address.province}، {order.address.address}، {order.address.post_Code}</p>
                            <p className="mb-2">نوع تحویل: {order.delivery_type === 'normal' ? 'عادی' : order.delivery_type}</p>
                            <p className={`mb-2 ${order.is_sent ? 'text-green-500' : 'text-red-500'}`}>وضعیت: {order.is_sent ? 'ارسال شده' : 'ارسال نشده'}</p>
                            {order.payment_status === 'reserved' && <Countdown initialTime={parseRemainingTime(order.remaining_reservation_time)} />}
                            <p className="mb-2">تاریخ سفارش: {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">اقلام:</h3>
                                {order.items.map(item => (
                                    <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                                        <p>محصول: {item.product_variant}</p>
                                        <p>تعداد: {item.quantity}</p>
                                        <p><strong>قیمت:</strong> {item.price.toLocaleString()} تومان</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">قیمت کل:</h3>
                                <p>کل: {order.total_price.total_price.toLocaleString()} تومان</p>
                                <p>سود شما از این خرید: {order.total_price.customer_savings.toLocaleString()} تومان</p>
                                <p>هزینه ارسال: {order.total_price.delivery.toLocaleString()} تومان</p>
                            </div>
                            {order.payment_status === 'reserved' && (
                                <button onClick={() => handleSetPending(order.id)} className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700">نهایی کردن سفارش</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>سفارشی یافت نشد.</p>
                )}
            </div>
        </div>
    );
};

export default UserOrder;
