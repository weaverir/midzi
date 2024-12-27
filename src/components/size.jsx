import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Size = () => {
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await axiosInstance.get('/padmin/sizes/');
                setSizes(response.data);
            } catch (error) {
                console.error('Error fetching sizes:', error);
                toast.error('خطا در دریافت اندازه‌ها.');
            }
        };

        fetchSizes();
    }, []);

    const deleteSize = async (id) => {
        try {
            await axiosInstance.delete(`/padmin/sizes/update/${id}/`);
            toast.success('اندازه با موفقیت حذف شد.');
            setSizes(sizes.filter(size => size.id !== id));
        } catch (error) {
            console.error('Error deleting size:', error);
            toast.error('خطا در حذف اندازه.');
        }
    };

    const editSize = (size) => {
        Swal.fire({
            title: 'ویرایش اندازه',
            html: `
                <input type="text" id="swal-input1" class="swal2-input" value="${size.name}" placeholder="نام اندازه">
                <input type="text" id="swal-input2" class="swal2-input" value="${size.description}" placeholder="توضیحات">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const description = document.getElementById('swal-input2').value;
                return { name, description };
            }
        }).then(async (result) => {
            if (result.value) {
                const { name, description } = result.value;
                try {
                    await axiosInstance.put(`/padmin/sizes/update/${size.id}/`, { name, description });
                    toast.success('اندازه با موفقیت به‌روزرسانی شد.');
                    setSizes(sizes.map(s =>
                        s.id === size.id ? { ...s, name, description } : s
                    ));
                } catch (error) {
                    console.error('Error updating size:', error);
                    toast.error('خطا در به‌روزرسانی اندازه.');
                }
            }
        });
    };

    const addSize = () => {
        Swal.fire({
            title: 'اضافه کردن اندازه جدید',
            html: `
                <input type="text" id="swal-input1" class="swal2-input" placeholder="نام اندازه">
                <input type="text" id="swal-input2" class="swal2-input" placeholder="توضیحات">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const description = document.getElementById('swal-input2').value;
                return { name, description };
            }
        }).then(async (result) => {
            if (result.value) {
                const { name, description } = result.value;
                try {
                    const response = await axiosInstance.post('/padmin/sizes/create/', { name, description });
                    toast.success('اندازه جدید با موفقیت اضافه شد.');
                    setSizes([...sizes, response.data]);
                } catch (error) {
                    console.error('Error adding size:', error);
                    toast.error('خطا در اضافه کردن اندازه.');
                }
            }
        });
    };

    return (
        <div>
            <h1 className="text-2xl dark:text-text_w py-4">اندازه‌های موجود</h1>
            <button
                onClick={addSize}
                className="mb-4 p-2 bg-green-500 text-white rounded-lg"
            >
                اضافه کردن اندازه جدید
            </button>
            {sizes.length > 0 ? (
                <ul className="flex flex-wrap justify-center">
                    {sizes.map(size => (
                        <li key={size.id} className="m-2 p-2 bg-white dark:bg-bgdark border rounded-lg flex flex-col items-center">
                            <span className="mt-2 text-black dark:text-text_w">{size.name}</span>
                            <span className="text-gray-300">{size.description}</span>
                            <button
                                onClick={() => editSize(size)}
                                className="mt-2 text-blue-500 hover:text-blue-700"
                            >
                                ویرایش
                            </button>
                            <button
                                onClick={() => deleteSize(size.id)}
                                className="mt-2 text-red-500 hover:text-red-700"
                            >
                                حذف
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>اندازه‌ای موجود نیست.</p>
            )}
        </div>
    );
};

export default Size;
