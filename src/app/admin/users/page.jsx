"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

const Page = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (page) => {
        try {
            const response = await axiosInstance.get(`padmin/customers/?page=${page}`);
            setUsers(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 10)); // assuming 10 users per page
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axiosInstance.get(`padmin/customers/${userId}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="p-4 bg-navblue dark:bg-navblueD">
            <h1 className="text-2xl dark:text-text_w mb-4">لیست کاربران</h1>
            <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="p-4 border bg-white dark:bg-bgdark dark:text-text_w rounded-lg dark:border-gray-600  cursor-pointer"
                        onClick={() => fetchUserDetails(user.id)}
                    >
                        <p className="text-lg font-semibold">{user.first_name || 'بدون نام'} {user.last_name || ''}</p>
                        <p><strong>شماره تلفن:</strong> {user.phone_number}</p>
                        <p><strong>وضعیت:</strong> {user.is_active ? 'فعال' : 'غیرفعال'}</p>
                        <p><strong>تاریخ ایجاد:</strong> {new Date(user.created_at).toLocaleString()}</p>
                        <p><strong>نوع کاربر:</strong> {user.is_admin ? 'ادمین' : 'کاربر معمولی'}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    صفحه قبل
                </button>
                <span>صفحه {page} از {totalPages}</span>
                <button
                    className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    صفحه بعد
                </button>
            </div>
            {selectedUser && (
                <div className="mt-6 p-4 bg-white border rounded-lg dark:border-gray-600 dark:bg-bgdark dark:text-white">
                    <h2 className="text-xl font-semibold mb-2">جزئیات کاربر</h2>
                    <p><strong>نام:</strong> {selectedUser.first_name}</p>
                    <p><strong>نام خانوادگی:</strong> {selectedUser.last_name}</p>
                    <p><strong>شماره تلفن:</strong> {selectedUser.phone_number}</p>
                    <p><strong>آدرس:</strong> {selectedUser.address}</p>
                    <p><strong>وضعیت:</strong> {selectedUser.is_active ? 'فعال' : 'غیرفعال'}</p>
                    <p><strong>تاریخ ایجاد:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
                    <p><strong>نوع کاربر:</strong> {selectedUser.is_admin ? 'ادمین' : 'کاربر معمولی'}</p>
                </div>
            )}
        </div>
    );
};

export default Page;
