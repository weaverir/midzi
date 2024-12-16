"use client";
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { CartContext } from '@/lib/cartAuth';
import { toast } from "react-hot-toast";

const CartModal = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState([]);
    const router = useRouter();
    const { fetchCartItemCount } = useContext(CartContext);
    const modalRef = useRef();

    const closeModal = () => {
        // Custom logic to close modal, e.g., updating a state variable or class
    };

    useEffect(() => {
        validateTokens();

        const handleRouteChange = () => {
            closeModal();
        };

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        document.addEventListener('click', handleClickOutside);
        router.events?.on('routeChangeStart', handleRouteChange);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            router.events?.off('routeChangeStart', handleRouteChange);
        };
    }, []);

    const validateTokens = async () => {
        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        if (!accessToken || !refreshToken) {
            setIsLoggedIn(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/accounts/basket/');
            if (response.status === 200) {
                setIsLoggedIn(true);
                fetchCart();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('خطا در اعتبارسنجی توکن‌ها:', error);
            setIsLoggedIn(false);
        }
    };

    const fetchCart = async () => {
        try {
            const response = await axiosInstance.get('/accounts/basket/');
            setCart(response.data[0].basket.items || []);
            console.log(cart)
        } catch (error) {
            console.error('خطا در دریافت سبد خرید:', error);
            toast.error('خطا در دریافت سبد خرید.');
        }
    };

    const updateItemQuantity = async (item, quantity) => {
        try {
            const basketId = localStorage.getItem('basket');
            await axiosInstance.put(`/accounts/basket/${basketId}/items/`, {
                product_variant_id: item.product_variant.id,
                quantity,
            });
            toast.success('سبد خرید با موفقیت بروزرسانی شد.');
            fetchCart(); // Refresh cart after update
            fetchCartItemCount(); // Update cart item count in CartContext
        } catch (error) {
            console.error('خطا در بروزرسانی آیتم سبد خرید:', error);
            toast.error('بروزرسانی سبد خرید ناموفق بود.');
        }
    };
    const removeFromCart = async (item) => {
        await updateItemQuantity(item, 0);
    };

    const calculateTotalPrice = (cart) => {
        return cart.reduce((total, item) => {
            const price = item.product_variant?.discounted_price || item.product_variant?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const CartItem = cart.length > 0;

    return (
        <div ref={modalRef} className="cart-modal w-max absolute p-4 top-12 z-50 left-0 bg-navblue font-sans_b dark:bg-navblueD dark:text-text_w rounded-xl text-text_b flex flex-col gap-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)] max-h-[500px]">
            {!CartItem ? (
                <div className="flex justify-center dark:bg-navblueD dark:text-text_w items-center">سبد خرید خالی است</div>
            ) : (
                <>
                    <h2 className="text-xl">سبد خرید</h2>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-60">
                        {cart.map((item, index) => (
                            <div key={index} className="flex gap-4 dark:bg-bgdark dark:text-text_w bg-white rounded-xl p-4">
                                <div
                                    className="h-24 w-24 bg-cover bg-center rounded"
                                    style={{ backgroundImage: `url(${`https://midzi.liara.run${item.thumbnail}` || '/default-image.png'})` }}
                                ></div>
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <div className="items-center flex justify-between gap-8">
                                            <h3 className="font-semibold">{item.product?.name || 'Product Name'}</h3>
                                            <div className="p-1 bg-myblue text-text_w rounded-xl">
                                                {item.product_variant?.discount_percentage ? (
                                                    <div className={"flex flex-col"}>
                                                        <span
                                                            className="ml-2 text-red-600">{item.product_variant?.discounted_price.toLocaleString()} تومان</span>
                                                        <span
                                                            className="line-through">{item.product_variant?.price.toLocaleString()} تومان</span>

                                                    </div>
                                                ) : (
                                                    `${item.product_variant?.price.toLocaleString()} تومان`
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm">رنگ: {item.product_variant?.color.name || 'Color'}</div>
                                        <div className="text-sm">سایز: {item.product_variant?.size.name || 'Size'}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>تعداد {item.quantity}</span>
                                        <span className="text-blue-500 cursor-pointer" onClick={() => removeFromCart(item)}>حذف</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center dark:bg-bgdark dark:text-text_w justify-between text-sm bg-white p-4 rounded-lg">
                            <span>جمع</span>
                            <span className="bg-myblue dark:bg-bgdark dark:text-text_w p-1 rounded-lg text-text_w">{calculateTotalPrice(cart).toLocaleString()} تومان</span>
                        </div>
                        <div className="flex justify-between text-sm mt-4">
                            <button className="bg-myblue rounded-lg p-1 text-text_w" onClick={() => router.push('/user/cart')}>مشاهده سبد</button>
                            <button className="bg-myblue rounded-lg p-1 text-text_w" onClick={() => router.push('/user/cart')}>تکمیل سفارش</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartModal;
