"use client";
import React, {useState, useContext, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import {AuthContext} from '@/lib/loginauth';
import {toast, Toaster} from 'react-hot-toast';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetCooldown, setResetCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {login} = useContext(AuthContext);
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
            timer = setInterval(() => {
                setResetCooldown((prevCooldown) => {
                    if (prevCooldown <= 1) {
                        toast.dismiss();
                        clearInterval(timer);
                    }
                    return prevCooldown - 1;
                });
            }, 1000);
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
                toast.success('ورود موفق');
                login(response.data.access, response.data.refresh);

                fetchBasketId();

                if (response.data.is_admin) {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                toast.error('کاربر یافت نشد');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'خطا در ورود. لطفاً دوباره امتحان کنید.');
        }
    };

    const handleForgotPassword = async () => {
        if (resetCooldown > 0) {
            toast.loading(`لطفاً ${resetCooldown} ثانیه منتظر بمانید`);
            return;
        }
        try {
            await axiosInstance.post('/accounts/resetpassword/', {phone_number: phoneNumber});
            toast.success('کد تایید به شماره موبایل شما ارسال شد.');
            setShowResetForm(true);
            setResetCooldown(120);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'خطا در ارسال کد تایید. لطفاً دوباره امتحان کنید.');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('رمزهای عبور مطابقت ندارند');
            return;
        }
        try {
            const response = await axiosInstance.post('/accounts/resetpassword/verify/', {
                phone_number: phoneNumber,
                "otp_code": otp,
                new_password: password,
            });
            if (response.status === 200) {
                toast.success('رمز عبور با موفقیت تغییر یافت');
                setShowResetForm(false);
            } else {
                toast.error('خطا در تغییر رمز عبور. لطفاً دوباره امتحان کنید.');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'خطا در تغییر رمز عبور. لطفاً دوباره امتحان کنید.');
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
            toast.error(error.response?.data?.error || 'خطا در دریافت سبد خرید');
        }
    };
    return (
        <div className="flex justify-center font-sans_b content-center my-2 items-center px-4 md:px-0">
            <div
                className="bg-navblue dark:bg-navblueD dark:text-text_w w-full max-w-[600px] rounded-2xl flex flex-col justify-center items-center mx-5">
                <div id="login_bulllshits"
                     className="flex flex-row justify-center text-xl items-center my-4 rounded-xl h-12 w-[80%] md:w-[50%] lg:w-[30%]">
                    <Link href="/login">
                        <span
                            className="cursor-pointer rounded-xl py-1 px-4 justify-center text-text_w mx-2 md:mx-3 w-20 md:w-16 flex items-center bg-mypurple">ورود</span>
                    </Link>
                    <Link href="/signup">
                        <span
                            className="cursor-pointer rounded-xl py-1 px-4 justify-center text-text_w mx-2 md:mx-3 w-20 md:w-16 flex items-center bg-myblue">عضویت</span>
                    </Link>
                </div>
                <div
                    className="flex flex-col justify-center items-center rounded-2xl shadow-xl dark:bg-bgdark dark:text-text_w bg-white w-[90%] mb-6">
                    <form onSubmit={handleLogin} className="w-full px-4">
                        <input
                            type="tel"
                            name="phone_number"
                            className=" px-3 dark:bg-navblueD text-black dark:text-text_w rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm flex justify-center w-full"
                            placeholder="شماره موبایل"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <div className="flex items-center mb-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="rounded-2xl h-12 dark:bg-navblueD text-black dark:text-text_w bg-navblue my-3 mx-auto shadow-sm flex-grow"
                                placeholder="رمز عبور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer font-awsome w-10 h-10 rounded-xl flex justify-center items-center bg-navblue mx-2 text-black dark:bg-navblueD dark:text-text_w"
                            >
                                {showPassword ? "" : ""}
                            </button>
                        </div>
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
                                className="rounded-2xl text-black dark:bg-navblueD dark:text-text_w h-12 w-[100%] bg-navblue my-3 mx-auto shadow-sm flex-grow"
                                placeholder="کد تایید"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <p className="text-orange-600 font-sans">رمز عبور 8 حرفی شامل حداقل یک حرف انگلیسی</p>
                            <div className="flex items-center mb-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="new_password"
                                    className="rounded-2xl text-black dark:bg-navblueD dark:text-text_w h-12 bg-navblue my-3 mx-auto shadow-sm flex-grow"
                                    placeholder="رمز عبور جدید"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="cursor-pointer font-awsome w-10 h-10 rounded-xl flex justify-center items-center bg-navblue mx-2 text-black dark:bg-navblueD dark:text-text_w"
                                >
                                    {showPassword ? "" : ""}
                                </button>
                            </div>
                            <div className="flex items-center mb-3">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    className="rounded-2xl text-black dark:bg-navblueD dark:text-text_w h-12 bg-navblue my-3 mx-auto shadow-sm flex-grow"
                                    placeholder="تکرار رمز عبور جدید"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="cursor-pointer font-awsome w-10 h-10 rounded-xl flex justify-center items-center bg-navblue mx-2 text-black dark:bg-navblueD dark:text-text_w"
                                >
                                    {showConfirmPassword ? "" : ""}
                                </button>
                            </div>
                            <p className="text-red-500">{`لطفاً ${resetCooldown} ثانیه برای درخواست دوباره کد تایید منتظر بمانید`}</p>
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
            <Toaster/>
        </div>
    );
};

export default Login;


