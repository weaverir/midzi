"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { BounceLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import AddPic from "@/components/admin/addpic";

const EditProduct = () => {
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingProduct, setSavingProduct] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [newColor, setNewColor] = useState({ name: '', hex_code: '' });
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [newSize, setNewSize] = useState({ name: '', description: '' });
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    useEffect(() => {
        if (productId) {
            fetchProduct();
            fetchCategories();
            fetchColors();
            fetchSizes();
        }
    }, [productId]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/padmin/product/${productId}/`);
            setProduct(response.data);
            setVariants(response.data.variants);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/padmin/category/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchColors = async () => {
        try {
            const response = await axiosInstance.get('/padmin/product/color/');
            setColors(response.data);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };
    const handleAddSize = async () => {
        setLoading(true);
        try {
            await axiosInstance.post(`/padmin/sizes/create/`, newSize);
            Swal.fire('اندازه اضافه شد!', 'اندازه جدید با موفقیت اضافه شد.', 'success');
            setShowSizeModal(false);
            fetchSizes(); // Refresh sizes
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'خطا در افزودن اندازه.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const handleAddColor = async () => {
        setLoading(true);
        try {
            await axiosInstance.post(`/padmin/product/color/`, newColor);
            Swal.fire('رنگ اضافه شد!', 'رنگ جدید با موفقیت اضافه شد.', 'success');
            setShowColorModal(false);
            fetchColors(); // Refresh colors
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'خطا در افزودن رنگ.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };



    const fetchSizes = async () => {
        try {
            const response = await axiosInstance.get('/padmin/sizes/');
            setSizes(response.data);
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setProduct({ ...product, category: selectedCategoryId });
    };
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index][field] = value;
        setVariants(updatedVariants);
    };

    const handleAddVariant = () => {
        Swal.fire({
            title: 'افزودن نوع جدید',
            html: `
                <select id="color" class="swal2-input">
                    <option value="">انتخاب رنگ</option>
                    ${colors.map(color => `<option value="${color.name}">${color.name} (${color.id}) (${color.hex_code})</option>`).join('')}
                </select>
                <input type="text" id="color_id" class="swal2-input" placeholder="آیدی رنگ" disabled>
                <input type="text" id="hex_code" class="swal2-input" placeholder="کد رنگ" disabled>
                <select id="size" class="swal2-input">
                    <option value="">انتخاب اندازه</option>
                    ${sizes.map(size => `<option value="${size.name}">${size.name} (${size.id})</option>`).join('')}
                </select>
                <input type="text" id="size_id" class="swal2-input" placeholder="آیدی اندازه" disabled>
                <input type="text" id="stock" class="swal2-input" placeholder="موجودی">
                <input type="text" id="price" class="swal2-input" placeholder="قیمت">
                <input type="text" id="discount_percentage" class="swal2-input" placeholder="تخفیف">
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    color: document.getElementById('color_id').value,
                    size: document.getElementById('size_id').value,
                    stock: document.getElementById('stock').value,
                    price: document.getElementById('price').value,
                    discount_percentage: document.getElementById('discount_percentage').value
                };
            }
        }).then((result) => {
            if (result.value) {
                saveNewVariant(result.value);
            }
        });

        document.getElementById('color').addEventListener('change', (e) => {
            const selectedColor = colors.find(color => color.name === e.target.value);
            document.getElementById('color_id').value = selectedColor ? selectedColor.id : '';
            document.getElementById('hex_code').value = selectedColor ? selectedColor.hex_code : '';
        });

        document.getElementById('size').addEventListener('change', (e) => {
            const selectedSize = sizes.find(size => size.name === e.target.value);
            document.getElementById('size_id').value = selectedSize ? selectedSize.id : '';
        });
    };

    const saveNewVariant = async (variant) => {
        try {
            await axiosInstance.post(`/padmin/product-variant/create/`, {
                product: productId,
                ...variant
            });
            Swal.fire('ذخیره شد!', 'نوع جدید با موفقیت اضافه شد.', 'success');
            fetchProduct(); // Refresh product details
        } catch (error) {
            console.error('Error saving new variant:', error);
            Swal.fire('خطا!', 'خطا در ذخیره نوع جدید.', 'error');
        }
    };

    const handleEditVariant = (index) => {
        const variant = variants[index];
        Swal.fire({
            title: 'ویرایش نوع',
            html: `
            <select id="color" class="swal2-input">
                <option value="">انتخاب رنگ</option>
                ${colors.map(color => `<option value="${color.id}" ${color.id === variant.color.id ? 'selected' : ''}>${color.name} (${color.hex_code})</option>`).join('')}
            </select>
            <input type="text" id="hex_code" class="swal2-input" value="${variant.color.hex_code}" placeholder="کد رنگ" disabled>
            <select id="size" class="swal2-input">
                <option value="">انتخاب اندازه</option>
                ${sizes.map(size => `<option value="${size.id}" ${size.id === variant.size.id ? 'selected' : ''}>${size.name}</option>`).join('')}
            </select>
            <input type="text" id="stock" class="swal2-input" value="${variant.stock}" placeholder="موجودی">
            <input type="text" id="price" class="swal2-input" value="${variant.price}" placeholder="قیمت">
            <input type="text" id="discount_percentage" class="swal2-input" value="${variant.discount_percentage}" placeholder="تخفیف">
        `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    color: document.getElementById('color').value,
                    size: document.getElementById('size').value,
                    stock: document.getElementById('stock').value,
                    price: document.getElementById('price').value,
                    discount_percentage: document.getElementById('discount_percentage').value
                };
            }
        }).then((result) => {
            if (result.value) {
                const updatedVariant = { ...variant, ...result.value };
                setVariants(variants.map((v, i) => i === index ? updatedVariant : v));
                saveVariant(updatedVariant);
            }
        });

        document.getElementById('color').addEventListener('change', (e) => {
            const selectedColor = colors.find(color => color.id === parseInt(e.target.value));
            document.getElementById('hex_code').value = selectedColor ? selectedColor.hex_code : '';
        });
    };

    const saveVariant = async (variant) => {
        try {
            await axiosInstance.put(`/padmin/product-variant/${variant.id}/`, {
                product: productId,
                color: variant.color, // Send color id
                size: variant.size,   // Send size id
                stock: variant.stock,
                price: variant.price,
                discount_percentage: variant.discount_percentage
            });
            Swal.fire('ذخیره شد!', 'نوع محصول با موفقیت ذخیره شد.', 'success');
        } catch (error) {
            console.error('Error saving variant:', error);
            Swal.fire('خطا!', 'خطا در ذخیره نوع محصول.', 'error');
        }
    };


    const handleDeleteVariant = async (index) => {
        const variant = variants[index];
        try {
            await axiosInstance.delete(`/padmin/product-variant/${variant.id}/`);
            setVariants(variants.filter((_, i) => i !== index));
            Swal.fire('حذف شد!', 'نوع محصول با موفقیت حذف شد.', 'success');
        } catch (error) {
            console.error('Error deleting variant:', error);
            Swal.fire('خطا!', 'خطا در حذف نوع محصول.', 'error');
        }
    };

    const handleThumbnailChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSaveProduct = async () => {
        setSavingProduct(true);
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('brand', product.brand);
        formData.append('description', product.description);
        formData.append('model_number', product.model_number);
        formData.append('available', product.available);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('material', product.material);
        formData.append('discount_percentage', product.discount_percentage);
        formData.append('slug', product.slug);
        formData.append('category', product.category); // Ensure the server expects 'category'
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            await axiosInstance.put(`/padmin/product/${productId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            Swal.fire('ذخیره شد!', 'محصول با موفقیت ذخیره شد.', 'success');
            router.push('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            Swal.fire('خطا!', 'خطا در ذخیره محصول.', 'error');
        } finally {
            setSavingProduct(false);
        }
    };
    return (
        <div className="p-4 w-[100%]">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <BounceLoader color="#36D7B7" size={60}/>
                </div>
            ) : product ? (
                <div className="bg-navblue dark:bg-navblueD rounded-lg shadow p-4 flex flex-col w-full">
                    <div className="text-2xl text-black dark:text-text_w font-bold mb-4">ویرایش محصول</div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 text-black dark:text-text_w">نام محصول</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 text-black dark:text-text_w">دسته‌بندی</label>
                        <select
                            name="category"
                            value={product.category || ""}
                            onChange={handleCategoryChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        >
                            <option
                                className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                                value="">انتخاب دسته‌بندی
                            </option>
                            {categories.map(category => (
                                <option
                                    className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                                    key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 dark:text-text_w">توضیحات</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        ></textarea>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 dark:text-text_w">قیمت</label>
                        <input
                            type="text"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 dark:text-text_w">موجودی</label>
                        <input
                            type="text"
                            name="stock"
                            value={product.stock}
                            onChange={handleInputChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col justify-start items-start mb-4">
                        <label className="mb-2 dark:text-text_w">موجود</label>
                        <input
                            type="checkbox"
                            name="available"
                            checked={product.available}
                            onChange={(e) => handleInputChange({ target: { name: 'available', value: e.target.checked } })}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 dark:text-text_w">تخفیف</label>
                        <input
                            type="text"
                            name="discount_percentage"
                            value={product.discount_percentage}
                            onChange={handleInputChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 dark:text-text_w">اسلاگ</label>
                        <input
                            type="text"
                            name="slug"
                            value={product.slug}
                            onChange={handleInputChange}
                            className="p-2 rounded border text-black dark:text-text_w dark:bg-bgdark dark:border-gray-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 dark:text-text_w">آپلود تصویر کاور </label>
                        <input
                            type="file"
                            name="thumbnail"
                            onChange={handleThumbnailChange}
                            className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={handleSaveProduct}
                        disabled={savingProduct}
                        className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                        {savingProduct ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    <AddPic/>
                    <div className="text-xl font-bold mt-4 mb-4">انواع</div>
                    {variants.map((variant, index) => (
                        <div key={index}
                             className="mb-4 p-4 border rounded-lg dark:border-gray-600 w-full flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
                            <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                <label className="text-sm font-semibold dark:text-text_w">رنگ</label>
                                <div className="p-2 rounded-lg border text-black dark:text-text_w dark:bg-gray-700 dark:border-gray-600">
                                    {variant.color.name}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                <label className="text-sm font-semibold dark:text-text_w">کد رنگ</label>
                                <div className="p-2 rounded-lg border text-black dark:text-text_w dark:bg-gray-700 dark:border-gray-600">
                                    {variant.color.hex_code}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                <label className="text-sm font-semibold dark:text-text_w">اندازه</label>
                                <div className="p-2 rounded-lg border text-black dark:text-text_w dark:bg-gray-700 dark:border-gray-600">
                                    {variant.size.name}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                <label className="text-sm font-semibold dark:text-text_w">موجودی</label>
                                <div className="p-2 rounded-lg border text-black dark:text-text_w dark:bg-gray-700 dark:border-gray-600">
                                    {variant.stock}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                <label className="text-sm font-semibold dark:text-text_w">قیمت</label>
                                <div className="p-2 rounded-lg border text-black dark:text-text_w dark:bg-gray-700 dark:border-gray-600">
                                    {variant.price}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 w-full md:w-1/3">
                                <label className="text-sm font-semibold dark:text-text_w">تخفیف</label>
                                <div className="p-2 rounded-lg border text-black dark:text-text_w dark:bg-gray-700 dark:border-gray-600">
                                    {variant.discount_percentage}%
                                </div>
                            </div>
                            <div className="flex justify-end w-full md:w-auto">
                                <button
                                    className="px-4 py-2 text-green-500"
                                    onClick={() => handleEditVariant(index)}
                                >
                                    <i className="fa fa-edit">ویرایش</i>
                                </button>
                                <button
                                    className="px-4 py-2 text-red-500"
                                    onClick={() => handleDeleteVariant(index)}
                                >
                                    <i className="fa fa-trash"> حذف</i>
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAddVariant}
                        className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-700"
                    >
                        افزودن نوع جدید
                    </button>
                    <button
                        onClick={() => setShowColorModal(true)}
                        className="py-2 px-4 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-700 mt-4"
                    >
                        افزودن رنگ جدید
                    </button>
                    <button
                        onClick={() => setShowSizeModal(true)}
                        className="py-2 px-4 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-700 mt-4"
                    >
                        افزودن اندازه جدید
                    </button>
                </div>
            ) : (
                <div>محصول یافت نشد.</div>
            )}
            {showColorModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
                        <h2 className="text-2xl mb-4">افزودن رنگ جدید</h2>
                        <div className="mb-4">
                            <label className="block mb-2">نام</label>
                            <input
                                type="text"
                                name="name"
                                value={newColor.name}
                                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">کد رنگ</label>
                            <input
                                type="text"
                                name="hex_code"
                                value={newColor.hex_code}
                                onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowColorModal(false)}
                                className="py-2 px-4 bg-red-500 text-white rounded-md shadow hover:bg-red-700 mr-2"
                            >
                                لغو
                            </button>
                            <button
                                onClick={handleAddColor}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
                            >
                                تایید
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSizeModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
                        <h2 className="text-2xl mb-4">افزودن اندازه جدید</h2>
                        <div className="mb-4">
                            <label className="block mb-2">نام</label>
                            <input
                                type="text"
                                name="name"
                                value={newSize.name}
                                onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">توضیحات</label>
                            <input
                                type="text"
                                name="description"
                                value={newSize.description}
                                onChange={(e) => setNewSize({ ...newSize, description: e.target.value })}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowSizeModal(false)}
                                className="py-2 px-4 bg-red-500 text-white rounded-md shadow hover:bg-red-700 mr-2"
                            >
                                لغو
                            </button>
                            <button
                                onClick={handleAddSize}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
                            >
                                تایید
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProduct;
