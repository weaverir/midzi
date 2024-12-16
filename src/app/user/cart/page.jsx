"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [basketItems, setBasketItems] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const currentBasketId = localStorage.getItem('basket');
        if (!accessToken) {
            router.push('/login'); // Redirect to /login if not logged in
        } else if (currentBasketId) {
            fetchBasketItems(currentBasketId);
        }
    }, [router]);

    const fetchBasketItems = async (basketId) => {
        try {
            const response = await axiosInstance.get(`https://midzi.liara.run/accounts/basket/${basketId}/items/`);
            if (response.status === 200) {
                setBasketItems(response.data.basket.items);

            }
        } catch (error) {
            console.error('Error fetching basket items:', error);
            toast.error('خطا در دریافت اقلام سبد خرید.');
        }
    };

    const updateItemQuantity = async (item, quantity) => {
        try {
            const basketId = localStorage.getItem('basket');
            if (quantity >= 0) {
                await axiosInstance.put(`/accounts/basket/${basketId}/items/`, {
                    product_variant_id: item.product_variant.id,
                    quantity,
                });
                toast.success('سبد خرید با موفقیت بروزرسانی شد.');
                fetchBasketItems(basketId);
            }
        } catch (error) {
            console.error('خطا در بروزرسانی آیتم سبد خرید:', error);
            toast.error('بروزرانی سبد خرید ناموفق بود.');
        }
    };

    const removeFromCart = async (item) => {
        await updateItemQuantity(item, 0);
    };

    const calculateTotalPrice = (basketItems) => {
        return basketItems.reduce((total, item) => {
            const price = item.product_variant?.discounted_price || item.product_variant?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const calculateTotalCount = (basketItems) => {
        return basketItems.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    };

    const handleOrderSubmit = async () => {
        const basketId = localStorage.getItem('basket');
        const accessToken = localStorage.getItem('access');
        try {
            const response = await axiosInstance.get(
                `https://midzi.liara.run/accounts/basket/${basketId}/request/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.status === 200 && response.data.payment_url) {
                toast.success('سفارش شما با موفقیت ثبت شد!');
                window.location.href = response.data.payment_url; // Redirect the user to the payment URL
            } else {
                toast.error('خطا در ثبت سفارش.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('خطا در ثبت سفارش.');
        }
    };
    return (
        <div className="p-4 bg-navblue w-full rounded-2xl font-sans_b dark:bg-navblueD dark:text-text_w">
            <div className="bg-navblue dark:bg-navblueD rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4 rounded-xl p-3 flex items-center justify-center dark:bg-bgdark dark:text-text_w">
                    اقلام سبد خرید
                </h2>
                {basketItems.length > 0 ? (
                    <ul className="space-y-4 dark:bg-bgdark dark:text-text_w rounded-xl flex flex-col gap-3">
                        {basketItems.map(item => (
                            <li key={item.id} className="flex items-center text-black justify-between gap-4 bg-white text-black dark:text-text_w dark:bg-bgdark p-4 rounded-lg shadow-md">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`https://midzi.liara.run${item.thumbnail}`}
                                        alt={item.product.name}
                                        className="w-20 h-20 rounded-md object-cover"
                                    />
                                    <div className="text-left">
                                        <p className="font-semibold text-sm md:text-base ">{item.product.name}</p>
                                        <p className="text-xs md:text-sm ">رنگ: {item.product_variant.color.name}</p>
                                        <p className="text-xs md:text-sm ">سایز: {item.product_variant.size.name}</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    {item.product_variant.discount_percentage > 0 ? (
                                        <>
                                            <p className="line-through  text-sm md:text-base">
                                                {item.product_variant.price} تومان
                                            </p>
                                            <p className="text-red-500 text-sm md:text-base font-bold">
                                                {item.product_variant.discounted_price} تومان
                                            </p>
                                        </>
                                    ) : (
                                        <p className=" font-bold text-sm md:text-base">
                                            {item.product_variant.price} تومان
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center text-black dark:text-text_w gap-2">
                                    <button
                                        onClick={() => updateItemQuantity(item, item.quantity - 1)}
                                        className="bg-red-500  px-2 py-1 rounded-full hover:bg-red-600"
                                    >
                                        -
                                    </button>
                                    <span className="text-black dark:text-text_w font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateItemQuantity(item, item.quantity + 1)}
                                        className="bg-green-500 text-black dark:text-text_w px-2 py-1 rounded-full hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item)}
                                    className="text-blue-500 hover:text-blue-700 text-sm md:text-base"
                                >
                                    حذف
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-white">سبد خرید شما خالی است.</p>
                )}
                {basketItems.length > 0 && (
                    <div className="mt-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-lg font-semibold text-black dark:text-text_w">تعداد کل اقلام: {calculateTotalCount(basketItems)}</p>
                            <p className="text-lg font-semibold text-black dark:text-text_w">جمع کل: {calculateTotalPrice(basketItems).toLocaleString()} تومان</p>
                        </div>
                        <button
                            onClick={handleOrderSubmit}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 mt-4 w-full md:w-auto"
                        >
                            ثبت سفارش و پرداخت
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
