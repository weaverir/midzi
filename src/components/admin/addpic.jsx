"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const AddPic = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState([]); // Initialize as an empty array
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const baseURL = 'https://midzi.liara.run';

    useEffect(() => {
        if (productId) {
            fetchImages();
        }
    }, [productId]);

    const fetchImages = async () => {
        try {
            const response = await axiosInstance.get(`/padmin/${productId}/images/`);
            const imageUrls = response.data.images.map(img => ({
                id: img.id,
                url: `${baseURL}${img.image}`
            }));
            setImages(imageUrls);
        } catch (error) {
            console.error('Error fetching images:', error);
            setImages([]); // Fallback to empty array on error
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUploadImage = async () => {
        if (!image) {
            Swal.fire('خطا!', 'لطفاً یک تصویر انتخاب کنید.', 'error');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('images', image);

        try {
            await axiosInstance.post(`/padmin/${productId}/upload-images/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('بارگذاری شد!', 'تصویر با موفقیت بارگذاری شد.', 'success');
            setImage(null);
            fetchImages(); // Refresh images
        } catch (error) {
            console.error('Error uploading image:', error);
            Swal.fire('خطا!', 'خطا در بارگذاری تصویر.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await axiosInstance.delete(`/padmin/${productId}/images/${imageId}/delete/`);
            Swal.fire('حذف شد!', 'تصویر با موفقیت حذف شد.', 'success');
            fetchImages(); // Refresh images
        } catch (error) {
            console.error('Error deleting image:', error);
            Swal.fire('خطا!', 'خطا در حذف تصویر.', 'error');
        }
    };

    return (
        <div className="p-4 w-full max-w-xl ">
            <h2 className={"font-sans_b text-2xl"}>تصاویر</h2>
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
                <button
                    onClick={handleUploadImage}
                    disabled={uploading}
                    className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                >
                    {uploading ? 'در حال بارگذاری...' : 'بارگذاری تصویر'}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative">
                        <img src={image.url} alt={`Image ${image.id}`} className="w-full h-auto rounded-lg"/>
                        <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-700"
                        >
                            <i className="fa fa-trash">حذف</i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddPic;
