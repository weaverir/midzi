"use client";
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { AuthContext } from '@/lib/loginauth'; // Import AuthContext

const List = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); // Use AuthContext
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        if (accessToken && refreshToken) {
            router.push('/user');
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('phone_number', phoneNumber);
        formData.append('password', password);
        try {
            const response = await axiosInstance.post('/accounts/login/', formData);
            if (response.status === 200) {
                toast.success('ورود موفق');
                login(response.data.access, response.data.refresh); // Call login from AuthContext

                // Fetch basket ID and save it in local storage
                fetchBasketId();

                // Check if the user is an admin and route accordingly
                if (response.data.is_admin) {
                    router.push('/admin');
                } else {
                    router.push('/user');
                }
            } else {
                toast.error('کاربر یافت نشد');
            }
        } catch (error) {
            toast.error('خطا در ورود. لطفاً دوباره امتحان کنید.');
        }
    };

    const fetchBasketId = async () => {
        try {
            const response = await axiosInstance.get('/accounts/basket/');
            const basketId = response.data[0]?.basket.id;
            if (basketId) {
                localStorage.setItem('basket', basketId);
                toast.success(`شماره سبد خرید : ${basketId}`);
            }
        } catch (error) {
            console.error('Error fetching basket ID:', error);
            toast.error('خطا در دریافت شناسه سبد خرید.');
        }
    };

    return (
        <div className="flex justify-center font-sans_b content-center my-2 items-center px-4 md:px-0">
            <div className="bg-navblue w-full max-w-[600px] rounded-2xl flex flex-col justify-center items-center mx-5">
                <div id="login_bulllshits" className="flex flex-row justify-center text-xl items-center my-4  rounded-xl h-12 w-[80%] md:w-[50%] lg:w-[30%]">
                    <Link href="/login">
                        <span className="cursor-pointer rounded-xl py-1 px-4 justify-center text-text_w mx-2 md:mx-3 w-20 md:w-16 flex items-center bg-mypurple">ورود</span>
                    </Link>
                    <Link href="/signup">
                        <span className="cursor-pointer rounded-xl py-1 px-4 justify-center text-text_w mx-2 md:mx-3 w-20 md:w-16 flex items-center bg-myblue">عضویت</span>
                    </Link>
                </div>
                <div className="flex flex-col justify-center items-center rounded-2xl shadow-xl bg-white w-[90%] mb-6">
                    <form onSubmit={handleLogin} className="w-full px-4">
                        <input
                            type="number"
                            name="phone_number"
                            className="appearance-none rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
                            placeholder="شماره موبایل"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <input
                            type="password"
                            name="password"
                            className="rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
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
                </div>
            </div>
        </div>
    );
};

export default List;
