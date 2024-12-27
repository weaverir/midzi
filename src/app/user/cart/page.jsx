"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const Page = () => {
    const [basketItems, setBasketItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('reserve');
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const currentBasketId = localStorage.getItem('basket');
        if (!accessToken) {
            router.push('/login'); // Redirect to /login if not logged in
        } else if (currentBasketId) {
            fetchBasketItems(currentBasketId);
            fetchAddresses();
        }
    }, [router]);

    const fetchBasketItems = async (basketId) => {
        try {
            const response = await axiosInstance.get(`https://midzi.liara.run/accounts/basket/${basketId}/items/`);
            if (response.status === 200) {
                const items = response.data.basket.items;
                // Remove items with zero stock and update quantities exceeding stock
                const updatedItems = [];
                for (const item of items) {
                    if (item.product_variant.stock === 0) {
                        await removeFromCart(item); // Remove item if stock is 0
                    } else if (item.quantity > item.product_variant.stock) {
                        await updateItemQuantity(item, item.product_variant.stock); // Update quantity to max stock
                        updatedItems.push({ ...item, quantity: item.product_variant.stock });
                    } else {
                        updatedItems.push(item);
                    }
                }
                setBasketItems(updatedItems);
            }
        } catch (error) {
            console.error('Error fetching basket items:', error);
            toast.error('خطا در دریافت اقلام سبد خرید.');
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get('https://midzi.liara.run/accounts/addresses/');
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('خطا در دریافت آدرس‌ها.');
        }
    };

    const addAddress = () => {
        Swal.fire({
            title: 'افزودن آدرس جدید',
            html: `
                <input type="text" id="address" class="swal2-input" placeholder="آدرس">
                <input type="text" id="post_Code" class="swal2-input" placeholder="کد پستی">
                <input type="text" id="province" class="swal2-input" placeholder="استان">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    address: document.getElementById('address').value,
                    post_Code: document.getElementById('post_Code').value,
                    province: document.getElementById('province').value
                };
            }
        }).then(async (result) => {
            if (result.value) {
                try {
                    await axiosInstance.post('https://midzi.liara.run/accounts/addresses/', result.value);
                    toast.success('آدرس جدید با موفقیت اضافه شد!');
                    fetchAddresses();
                } catch (error) {
                    console.error('Error adding address:', error);
                    toast.error('خطا در افزودن آدرس.');
                }
            }
        });
    };
    const updateItemQuantity = async (item, quantity) => {
        try {
            const basketId = localStorage.getItem('basket');
            if (quantity >= 0) {
                if (quantity > item.product_variant.stock) {
                    quantity = item.product_variant.stock; // Set quantity to max stock
                }
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
        try {
            const basketId = localStorage.getItem('basket');
            await axiosInstance.put(`/accounts/basket/${basketId}/items/`, {
                product_variant_id: item.product_variant.id,
                quantity: 0,
            });
            toast.success('آیتم با موفقیت از سبد خرید حذف شد.');
            fetchBasketItems(basketId);
        } catch (error) {
            console.error('خطا در حذف آیتم سبد خرید:', error);
            toast.error('حذف آیتم از سبد خرید ناموفق بود.');
        }
    };

    const calculateTotalPrice = (basketItems) => {
        const totalPrice = basketItems.reduce((total, item) => {
            const price = item.product_variant?.discounted_price || item.product_variant?.price || 0;
            return total + price * item.quantity;
        }, 0);
        return totalPrice >= 2000000 ? totalPrice : totalPrice + 49000; // Free shipping for total price >= 2000000
    };

    const calculateTotalCount = (basketItems) => {
        return basketItems.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    };

    const handleOrderSubmit = async () => {
        const basketId = localStorage.getItem('basket');
        const accessToken = localStorage.getItem('access');
        const url = paymentMethod === 'reserve'
            ? `https://midzi.liara.run/accounts/basket/${basketId}/request/`
            : `https://midzi.liara.run/accounts/basket/${basketId}/normal/`;
        try {
            const response = await axiosInstance.get(
                url,
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
                            <li key={item.id} className="flex flex-col md:flex-row items-center text-black justify-between gap-4 bg-white dark:text-text_w dark:bg-bgdark p-4 rounded-lg shadow-md">
                                <div className="flex flex-col md:flex-row items-center gap-4">
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
                                            <p className="line-through text-sm md:text-base">
                                                {item.product_variant.price} تومان
                                            </p>
                                            <p className="text-red-500 text-sm md:text-base font-bold">
                                                {item.product_variant.discounted_price} تومان
                                            </p>
                                        </>
                                    ) : (
                                        <p className="font-bold text-sm md:text-base">
                                            {item.product_variant.price} تومان
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center text-black dark:text-text_w gap-2">
                                    <button
                                        onClick={() => updateItemQuantity(item, item.quantity - 1)}
                                        className="bg-red-500 px-2 py-1 rounded-full hover:bg-red-600"
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
                    <>
                        <div className="mt-4 flex flex-col md:flex-row justify بین items-center gap-4">
                            <p className="text-lg font-semibold text-black dark:text-text_w">تعداد کل اقلام: {calculateTotalCount(basketItems)}</p>
                            <p className="text-lg font-semibold text-black dark:text-text_w">
                                جمع کل: {calculateTotalPrice(basketItems).toLocaleString()} تومان
                                {calculateTotalPrice(basketItems) >= 2000000 ? '(ارسال رایگان)' : '(به همراه هزینه پستی)'}
                            </p>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2 text-black dark:text-text_w">انتخاب آدرس:</h3>
                            <ul className="space-y-2">
                                {addresses.map(address => (
                                    <li
                                        key={address.id}
                                        className={`p-2 border rounded-lg cursor-pointer ${selectedAddress === address.id ? 'border-green-500' : 'border-gray-300'} bg-white dark:bg-bgdark`}
                                        onClick={() => setSelectedAddress(address.id)}
                                    >
                                        {address.province}، {address.address}،  {address.post_Code}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={addAddress}
                                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
                            >
                                افزودن آدرس جدید
                            </button>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2 text-black dark:text-text_w">انتخاب روش پرداخت:</h3>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setPaymentMethod('reserve')}
                                    className={`py-2 px-4 rounded-lg shadow-md ${paymentMethod === 'reserve' ? 'border-2 border-green-500' : 'border'} bg-white dark:bg-bgdark`}
                                >
                                    رزرو
                                </button>
                                <p>رزرو شما به مدت 72 ساعت پس از خرید به سفارش تبدیل میشود و شما قاددر به اضافه کردن
                                    ایتم بدون پرداخت هزینه پستی در این 72 ساعت خواهید بود </p>
                                <button
                                    onClick={() => setPaymentMethod('normal')}
                                    className={`py-2 px-4 rounded-lg shadow-md ${paymentMethod === 'normal' ? 'border-2 border-green-500' : 'border'} bg-white dark:bg-bgdark  `}
                                >
                                    ارسال سریع پستی
                                </button>
                                <p> در سریع ترین زمان ممکن بسته شما ارسال خواهد شد  </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleOrderSubmit}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 mt-4 w-full md:w-auto"
                                disabled={!selectedAddress}
                            >
                                ثبت سفارش و پرداخت
                            </button>
                            {!selectedAddress && (
                                <p className="text-red-500 text-sm mt-2">لطفاً یک آدرس را انتخاب کنید</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Page;
