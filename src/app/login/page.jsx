"use client";
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { AuthContext } from '@/lib/loginauth';
import {toast} from "react-hot-toast"; // Import AuthContext


const List = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetCooldown, setResetCooldown] = useState(0);
    const { login } = useContext(AuthContext); // Use AuthContext
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        if (accessToken && refreshToken) {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        let timer;
        if (resetCooldown > 0) {
            timer = setInterval(() => setResetCooldown(resetCooldown - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resetCooldown]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('phone_number', phoneNumber);
        formData.append('password', password);
        try {
            const response = await axiosInstance.post('/accounts/login/', formData);
            if (response.status === 200) {
                toast.success('ورود موفق')
                login(response.data.access, response.data.refresh); // Call login from AuthContext

                // Fetch basket ID and save it in local storage
                fetchBasketId();

                // Check if the user is an admin and route accordingly
                if (response.data.is_admin) {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {

                toast.error('کاربر یافت نشد')
            }
        } catch (error) {
            Swal.fire('خطا در ورود. لطفاً دوباره امتحان کنید.', '', 'error');
        }
    };

    const handleForgotPassword = async () => {
        if (resetCooldown > 0) {
            toast.loading(`لطفاً ${resetCooldown} ثانیه منتظر بمانید`)
            return;
        }
        try {
            await axiosInstance.post('https://midzi.liara.run/accounts/resetpassword/', { phone_number: phoneNumber });
            Swal.fire('کد تایید به شماره موبایل شما ارسال شد.', '', 'success');
            setShowResetForm(true);
            setResetCooldown(120); // Set the cooldown to 120 seconds
        } catch (error) {
            Swal.fire('خطا در ارسال کد تایید. لطفاً دوباره امتحان کنید.', '', 'error');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('https://midzi.liara.run/accounts/resetpassword/verify/', {
                phone_number: phoneNumber,
                "otp_code" : otp,
                new_password :password,
            });
            if (response.status === 200) {
                toast.success('رمز عبور با موفقیت تغییر یافت')
                setShowResetForm(false);
            } else {

                toast.error('خطا در تغییر رمز عبور. لطفاً دوباره امتحان کنید.')

            }
        } catch (error) {

            toast.error('خطا در تغییر رمز عبور. لطفاً دوباره امتحان کنید.')
        }
    };

    const fetchBasketId = async () => {
        try {
            const response = await axiosInstance.get('/accounts/basket/');
            const basketId = response.data[0]?.basket.id;
            if (basketId) {
                localStorage.setItem('basket', basketId);
            }
        } catch (error) {

            toast.error("خطا در دریافت سبد خرید ")
        }
    };

    return (
        <div className="flex justify-center font-sans_b content-center my-2 items-center px-4 md:px-0">
            <div className="bg-navblue dark:bg-navblueD dark:text-text_w w-full max-w-[600px] rounded-2xl flex flex-col justify-center items-center mx-5">
                <div id="login_bulllshits" className="flex flex-row justify-center text-xl items-center my-4 rounded-xl h-12 w-[80%] md:w-[50%] lg:w-[30%]">
                    <Link href="/login">
                        <span className="cursor-pointer rounded-xl py-1 px-4 justify-center text-text_w mx-2 md:mx-3 w-20 md:w-16 flex items-center bg-mypurple">ورود</span>
                    </Link>
                    <Link href="/signup">
                        <span className="cursor-pointer rounded-xl py-1 px-4 justify-center text-text_w mx-2 md:mx-3 w-20 md:w-16 flex items-center bg-myblue">عضویت</span>
                    </Link>
                </div>
                <div className="flex flex-col justify-center items-center rounded-2xl shadow-xl dark:bg-bgdark dark:text-text_w bg-white w-[90%] mb-6">
                    <form onSubmit={handleLogin} className="w-full px-4">
                        <input
                            type="number"
                            name="phone_number"
                            className="appearance-none dark:bg-navblueD dark:text-text_w rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
                            placeholder="شماره موبایل"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            className="rounded-2xl h-12 dark:bg-navblueD dark:text-text_w bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
                            placeholder="رمز عبور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="cursor-pointer bg-myblue w-36 mb-5 h-10 mx-auto rounded-xl flex justify-center items-center text-text_w"
                        >
                            ورود
                        </button>
                    </form>
                    <button
                        onClick={handleForgotPassword}
                        className="cursor-pointer bg-red-500 w-36 mb-5 h-10 mx-auto rounded-xl flex justify-center items-center text-text_w"
                    >
                        فراموشی رمز عبور
                    </button>
                    {showResetForm && (
                        <form onSubmit={handleVerify} className="w-full px-4">
                            <input
                                type="number"
                                name="otp"
                                className="rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
                                placeholder="کد تایید"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <input
                                type="password"
                                name="password"
                                className="rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
                                placeholder="رمز عبور جدید"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="cursor-pointer bg-myblue w-36 mb-5 h-10 mx-auto rounded-xl flex justify-center items-center text-text_w"
                            >
                                تغییر رمز عبور
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default List;
