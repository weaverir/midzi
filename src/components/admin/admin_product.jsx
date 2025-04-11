"use client";
import React, {useState, useEffect} from 'react';
import {BounceLoader} from 'react-spinners';
import Swal from 'sweetalert2';
import {useRouter} from 'next/navigation';
import axiosInstance from '@/lib/axios';
const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        stock: 0,
        price: 0
    });
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/padmin/product/?page=${page}`);
            setProducts(response.data.results); // Reset products for the current page
            setCount(response.data.count);
            setTotalPages(response.data.total_pages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchProducts(newPage);
    };

    const handleDeleteProduct = (productId) => {
        Swal.fire({
            title: 'آیا مطمئن هستید؟',
            text: 'این عملیات قابل بازگشت نیست!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'بله، حذف شود!',
            cancelButtonText: 'لغو',
            customClass: {
                container: 'custom-swal-container'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/padmin/product/${productId}/`);
                    setProducts(products.filter(product => product.id !== productId));
                    Swal.fire(
                        'حذف شد!',
                        'محصول با موفقیت حذف شد.',
                        'success',
                        {
                            customClass: {
                                container: 'custom-swal-container'
                            }
                        }
                    );
                } catch (error) {
                    console.error('Error deleting product:', error);
                    Swal.fire(
                        'خطا!',
                        'خطا در حذف محصول.',
                        'error',
                        {
                            customClass: {
                                container: 'custom-swal-container'
                            }
                        }
                    );
                }
            }
        });
    };

    const handleEditProduct = (productId) => {
        router.push(`/admin/products/id?id=${productId}`);
    };

    const handleAddProduct = () => {
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewProduct({...newProduct, [name]: value});
    };

    const handleSubmitNewProduct = async () => {
        setLoading(true);
        try {
            await axiosInstance.post(`/padmin/product/create/`, newProduct);
            Swal.fire('ایجاد شد!', 'محصول با موفقیت ایجاد شد.', 'success');
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error creating product:', error);
            Swal.fire('خطا!', 'خطا در ایجاد محصول.', 'error');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-4 bg-navblue dark:bg-navblueD dark:text-text_w rounded-2xl w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">محصولات (تعداد کل {count})</div>
                <button
                    onClick={handleAddProduct}
                    className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-700 flex items-center justify-center"
                >
                    <span className="mr-2">محصول جدید</span>
                    <i className="fa fa-plus"></i>
                </button>
            </div>
            {loading && products.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                    <BounceLoader color="#36D7B7" size={60}/>
                </div>
            ) : (
                <>
                    {products.length > 0 ? (
                        <div
                            className="overflow-y-auto max-h-screen w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div key={product.id}
                                     className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col mb-4 w-full">
                                    <div
                                        className="h-32 bg-cover bg-center rounded-md mb-2"
                                        style={{backgroundImage: `url(${product.thumbnail})`}}
                                    ></div>
                                    <div className="flex flex-col">
                                        <div className="text-lg font-semibold">{product.name}</div>
                                        <div className="text-sm ">قیمت: {product.price} تومان</div>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <button
                                            onClick={() => handleEditProduct(product.id)}
                                            className="py-1 px-3 bg-green-500 text-white rounded-md shadow hover:bg-green-700 flex items-center justify-center"
                                        >
                                            <span className="mr-2">ویرایش</span>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="py-1 px-3 bg-red-500 text-white rounded-md shadow hover:bg-red-700 flex items-center justify-center"
                                        >
                                            <span className="mr-2">حذف</span>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>هیچ محصولی یافت نشد.</div>
                    )}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="py-2 px-4 bg-myblue text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            قبلی
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="py-2 px-4 bg-myblue text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            بعدی
                        </button>
                    </div>
                </>
            )}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full max-w-md">
                        <h2 className="text-2xl mb-4">محصول جدید</h2>
                        <div className="mb-4">
                            <label className="block mb-2">نام</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">توضیحات</label>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">موجودی</label>
                            <input
                                type="number"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputChange}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">قیمت</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                className="p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="py-2 px-4 bg-red-500 text-white rounded-md shadow hover:bg-red-700 mr-2"
                            >
                                لغو
                            </button>
                            <button
                                onClick={handleSubmitNewProduct}
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

export default AdminProduct;



