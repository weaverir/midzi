"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import UserLayout from "@/app/user/layout";
import RightSidebar from "@/components/user/rightsidecomponent";

const Admin = () => {
    const [info, setInfo] = useState({});
    const [editInfo, setEditInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
        post_Code: '',
        address: '',
        phone_number: ''
    });
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('access');
        const refreshToken = localStorage.getItem('refresh');

        if (!accessToken || !refreshToken) {
            router.push('/login');
        } else {
            const userInfo = async () => {
                try {
                    const response = await axiosInstance.get("/accounts/dashboard/");
                    if (response.data.is_admin === false) {
                        router.push('/user');
                    } else {
                        setInfo(response.data);

                        setEditInfo({
                            first_name: response.data.first_name,
                            last_name: response.data.last_name,
                            email: response.data.email,
                            post_Code: response.data.post_Code,
                            address: response.data.address,
                            phone_number: response.data.phone_number
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            };

            userInfo();
        }
    }, [router]);

    const handleChange = (e) => {
        setEditInfo({
            ...editInfo,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.put("/accounts/dashboard/", editInfo);
            if (response.status === 200) {
                toast.success("اطلاعات با موفقیت بروز شد!");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
            toast.error("خطا در بروز رسانی اطلاعات.");
        }
    };

    return (
        <>
            <div className="flex-1 bg-navblue dark:bg-navblueD dark:text-text_w p-4 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">نام</label>
                        <input
                            type="text"
                            name="first_name"
                            value={editInfo.first_name}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 dark:bg-bgdark rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">نام خانوادگی</label>
                        <input
                            type="text"
                            name="last_name"
                            value={editInfo.last_name}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full shadow-sm sm:text-sm dark:bg-bgdark border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">ایمیل</label>
                        <input
                            type="email"
                            name="email"
                            value={editInfo.email}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full dark:bg-bgdark shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">کد پستی</label>
                        <input
                            type="text"
                            name="post_Code"
                            value={editInfo.post_Code}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full dark:bg-bgdark shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">آدرس</label>
                        <input
                            type="text"
                            name="address"
                            value={editInfo.address}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full dark:bg-bgdark shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">شماره تلفن</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={editInfo.phone_number}
                            disabled
                            className="mt-1 p-2 block w-full dark:bg-bgdark shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div className="sm:col-span-2 flex justify-center items-center max-w[300px]">
                        <button type="submit" className="w-full max-w-80 py-2 px-4 bg-myblue text-white rounded-md shadow hover:bg-blue-700">
                            بروزرسانی
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Admin;
