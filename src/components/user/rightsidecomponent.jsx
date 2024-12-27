"use client";
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/lib/UserContext'; // Import UserContext

const RightSidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { info } = useContext(UserContext); // Use context to get user info

    const handleMenuToggle = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('basket');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsMenuOpen(false)

        // Force page reload
        window.location.reload();
    };

    return (
        <>
            <div className="lg:hidden">
                <button
                    className="text-xl bg-myblue text-white p-2 rounded"
                    onClick={handleMenuToggle}
                >
                    {isMenuOpen ? '✖' : '☰'}
                </button>
            </div>
            <div className="hidden lg:block lg:w-[300px]">
                <div className="flex flex-col bg-navblue shadow-lg dark:bg-navblueD justify-start items-center gap-10 rounded-2xl p-4 px-2">
                    <div className="flex flex-row justify-between gap-3 items-center">
                        <div className="font-awsome text-white h-10 w-10 rounded-full bg-mypurple flex items-center justify-center"></div>
                        <div className="h-10 rounded-full dark:bg-bgdark dark:text-text_w text-black flex-row flex bg-white p-2 gap-1 items-center justify-center">
                            <div>{info.first_name}</div> <div>{info.last_name}</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-8 w-full">
                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={() => router.push('/user')}>اطلاعات کاربری
                        </div>

                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={() => router.push('/user/cart')}>سبد خرید
                        </div>

                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={() => router.push('/user/orders')}>سفارش ها
                        </div>
                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={handleLogout}>خروج
                        </div>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed top-0 left-0 w-full h-full bg-navblue dark:bg-navblueD flex flex-col items-center justify-center z-50">
                    <button
                        className="absolute top-4 right-4 text-xl bg-myblue text-white p-2 rounded"
                        onClick={handleMenuToggle}
                    >
                        ✖
                    </button>
                    <div className="flex flex-row justify-between gap-3 items-center">
                        <div className="font-awsome text-white h-10 w-10 rounded-full bg-mypurple flex items-center justify-center"></div>
                        <div className="h-10 rounded-full dark:bg-bgdark dark:text-text_w text-black flex-row flex bg-white p-2 gap-1 items-center justify-center">
                            <div>{info.first_name}</div> <div>{info.last_name}</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-8 w-full mt-8">
                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={() => {
                                router.push('/user')
                                setIsMenuOpen(false)
                            }}>اطلاعات کاربری
                        </div>
                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={() => {
                                router.push('/user/cart')
                                setIsMenuOpen(false)
                            }}>سبد خرید
                        </div>

                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={() => {
                                router.push('/user/orders')
                                setIsMenuOpen(false)
                            }}>سفارش ها
                        </div>
                        <div
                            className="flex h-12 w-[70%] rounded-full dark:bg-bgdark dark:text-text_w bg-white shadow-lg justify-center p-4 items-center text-black cursor-pointer"
                            onClick={handleLogout}>خروج
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RightSidebar;
