"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';


const AdminPanel = () => {
    const [info, setInfo] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [editInfo, setEditInfo] = useState({
        first_name: '',
        last_name: '',
        email: '',
        post_Code: '',
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
                    if (response.data.is_admin === false ) {
                        router.push('/user');
                    } else {
                        setInfo(response.data);
                        setEditInfo({
                            first_name: response.data.first_name,
                            last_name: response.data.last_name,
                            email: response.data.email,
                            post_Code: response.data.post_Code,
                            phone_number: response.data.phone_number
                        });
                        fetchAddresses();
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            };

            userInfo();
        }
    }, [router]);

    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get("/accounts/addresses/");
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("خطا در دریافت آدرس‌ها.");
        }
    };

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

    const handleAddAddress = () => {
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
                    await axiosInstance.post("/accounts/addresses/", result.value);
                    toast.success("آدرس جدید با موفقیت اضافه شد!");
                    fetchAddresses();
                } catch (error) {
                    console.error("Error adding address:", error);
                    toast.error("خطا در افزودن آدرس جدید.");
                }
            }
        });
    };

    const handleEditAddress = (address) => {
        Swal.fire({
            title: 'ویرایش آدرس',
            html: `
                <input type="text" id="address" class="swal2-input" placeholder="آدرس" value="${address.address}">
                <input type="text" id="post_Code" class="swal2-input" placeholder="کد پستی" value="${address.post_Code}">
                <input type="text" id="province" class="swal2-input" placeholder="استان" value="${address.province}">
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
                    await axiosInstance.put(`/accounts/addresses/${address.id}/`, result.value);
                    toast.success("آدرس با موفقیت ویرایش شد!");
                    fetchAddresses();
                } catch (error) {
                    console.error("Error editing address:", error);
                    toast.error("خطا در ویرایش آدرس.");
                }
            }
        });
    };

    const handleDeleteAddress = (id) => {
        Swal.fire({
            title: 'حذف آدرس',
            text: "آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'بله، حذف شود!',
            cancelButtonText: 'لغو'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/accounts/addresses/${id}/`);
                    toast.success("آدرس با موفقیت حذف شد!");
                    fetchAddresses();
                } catch (error) {
                    console.error("Error deleting address:", error);
                    toast.error("خطا در حذف آدرس.");
                }
            }
        });
    };

    return (
        <>
            <div className="flex-1 bg-navblue dark:bg-navblueD dark:text-text_w p-4 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w"> نام (الزامی)</label>
                        <input
                            type="text"
                            name="first_name"
                            value={editInfo.first_name}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 dark:bg-bgdark rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w">نام خانوادگی (الزامی) </label>
                        <input
                            type="text"
                            name="last_name"
                            value={editInfo.last_name}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full shadow-sm sm:text-sm dark:bg-bgdark border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w"> ایمیل</label>
                        <input
                            type="email"
                            name="email"
                            value={editInfo.email}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full dark:bg-bgdark shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text_w"> شماره تلفن (الزامی)</label>
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
                <div className="mt-4">
                    <button
                        onClick={handleAddAddress}
                        className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-700"
                    >
                        افزودن آدرس جدید
                    </button>
                </div>
                <div className="mt-4">
                    {addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <div key={index} className="p-4 mb-4 border bg-white dark:bg-bgdark dark:text-text_w rounded-lg dark:border-gray-600">
                                <p className="dark:text-text_w">آدرس: {address.address}</p>
                                <p className="dark:text-text_w">کد پستی: {address.post_Code}</p>
                                <p className="dark:text-text_w">استان: {address.province}</p>
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => handleEditAddress(address)}
                                        className="py-1 px-3 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-700 mx-2"
                                    >
                                        ویرایش
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="py-1 px-3 bg-red-500 text-white rounded-md shadow hover:bg-red-700"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="dark:text-text_w">آدرسی ثبت نشده است.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminPanel;



