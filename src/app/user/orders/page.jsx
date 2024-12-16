"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrderHistoryPage = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const basketId = localStorage.getItem('basket');
        if (!accessToken) {
            router.push('/login'); // Redirect to /login if not logged in
        } else if (basketId) {
            fetchOrderHistory(basketId);
        }
    }, [router]);

    const fetchOrderHistory = async (basketId) => {
        setLoading(true);  // Show loading screen
        try {
            const response = await axiosInstance.get(`https://midzi.liara.run/accounts/basket/${basketId}/order_history/`);
            setOrderHistory(response.data.items);
            toast.success('سفارشات آپدیت شد ');
        } catch (error) {
            console.error('Error fetching order history:', error);
            toast.error('خطا در گرفتن سفارشات');
        } finally {
            setLoading(false);  // Hide loading screen
        }
    };

    return (
        <div className="p-4 bg-navblue w-full rounded-2xl font-sans_b dark:bg-navblueD dark:text-text_w">
            <div className="bg-navblue dark:bg-navblueD rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4 rounded-xl p-3 flex items-center justify-center dark:bg-bgdark dark:text-text_w">
                    تاریخچه سفارشات
                </h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-center text-white">در حال بارگذاری...</p>
                    </div>
                ) : (
                    <ul className="space-y-4 dark:bg-navblueD dark:text-text_w rounded-xl flex flex-col gap-3">
                        {orderHistory.length > 0 ? (
                            orderHistory.map(order => (
                                <li key={order.id} className="flex items-center text-black justify-between gap-4 bg-white text-black dark:text-text_w dark:bg-bgdark p-4 rounded-lg shadow-md">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://midzi.liara.run${order.thumbnail}`}
                                            alt={order.product.name}
                                            className="w-20 h-20 rounded-md object-cover"
                                        />
                                        <div className="text-left">
                                            <p className="font-semibold text-sm md:text-base ">{order.product.name}</p>
                                            <p className="text-xs md:text-sm ">توضیحات: {order.product.description}</p>
                                            <p className="text-xs md:text-sm ">رنگ: {order.product_variant.color.name}</p>
                                            <p className="text-xs md:text-sm ">سایز: {order.product_variant.size.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm md:text-base">{order.price} تومان</p>
                                        <p className="text-sm md:text-base">قیمت کل: {order.total_price} تومان</p>
                                        <p className="text-sm md:text-base">تعداد: {order.quantity}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-center text-white">هیچ تاریخچه سفارشی یافت نشد.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
