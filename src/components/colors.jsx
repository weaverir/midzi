import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const Colors = () => {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await axiosInstance.get('/padmin/product/color/');
                setColors(response.data);
            } catch (error) {
                console.error('Error fetching colors:', error);
                toast.error('خطا در دریافت رنگ‌ها.');
            }
        };

        fetchColors();
    }, []);

    const deleteColor = async (id) => {
        try {
            await axiosInstance.delete(`/padmin/product/color/${id}/`);
            toast.success('رنگ با موفقیت حذف شد.');
            setColors(colors.filter(color => color.id !== id));
        } catch (error) {
            console.error('Error deleting color:', error);
            toast.error('خطا در حذف رنگ.');
        }
    };

    const editColor = (color) => {
        Swal.fire({
            title: 'ویرایش رنگ',
            html: `
                <input type="text" id="swal-input1" class="swal2-input" value="${color.name}" placeholder="نام رنگ">
                <input type="text" id="swal-input2" class="swal2-input" value="${color.hex_code}" placeholder="کد هگز">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const hex_code = document.getElementById('swal-input2').value;
                return { name, hex_code };
            }
        }).then(async (result) => {
            if (result.value) {
                const { name, hex_code } = result.value;
                try {
                    await axiosInstance.put(`/padmin/product/color/${color.id}/`, { name, hex_code });
                    toast.success('رنگ با موفقیت به‌روزرسانی شد.');
                    setColors(colors.map(c =>
                        c.id === color.id ? { ...c, name, hex_code } : c
                    ));
                } catch (error) {
                    console.error('Error updating color:', error);
                    toast.error('خطا در به‌روزرسانی رنگ.');
                }
            }
        });
    };

    const addColor = () => {
        Swal.fire({
            title: 'اضافه کردن رنگ جدید',
            html: `
                <input type="text" id="swal-input1" class="swal2-input" placeholder="نام رنگ">
                <input type="text" id="swal-input2" class="swal2-input" placeholder="کد هگز">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const hex_code = document.getElementById('swal-input2').value;
                return { name, hex_code };
            }
        }).then(async (result) => {
            if (result.value) {
                const { name, hex_code } = result.value;
                try {
                    const response = await axiosInstance.post('/padmin/product/color/', { name, hex_code });
                    toast.success('رنگ جدید با موفقیت اضافه شد.');
                    setColors([...colors, response.data]);
                } catch (error) {
                    console.error('Error adding color:', error);
                    toast.error('خطا در اضافه کردن رنگ.');
                }
            }
        });
    };

    return (
        <div>
            <h1 className="text-2xl dark:text-text_w py-4">رنگ‌های موجود</h1>
            <button
                onClick={addColor}
                className="mb-4 p-2 bg-green-500 text-white rounded-lg"
            >
                اضافه کردن رنگ جدید
            </button>
            {colors.length > 0 ? (
                <ul className="flex flex-wrap justify-center">
                    {colors.map(color => (
                        <li key={color.id} className="m-2 p-2 bg-white dark:bg-bgdark border rounded-lg flex flex-col items-center">
                            <div
                                className="w-12 h-12 rounded-full"
                                style={{ backgroundColor: color.hex_code }}
                            ></div>
                            <span className="mt-2 text-black dark:text-text_w">{color.name}</span>
                            <span className="text-gray-300">{color.hex_code}</span>
                            <button
                                onClick={() => editColor(color)}
                                className="mt-2 text-blue-500 hover:text-blue-700"
                            >
                                ویرایش
                            </button>
                            <button
                                onClick={() => deleteColor(color.id)}
                                className="mt-2 text-red-500 hover:text-red-700"
                            >
                                حذف
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>رنگی موجود نیست.</p>
            )}
        </div>
    );
};

export default Colors;
