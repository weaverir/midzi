"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';

const Page = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ title: '', parent: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('padmin/category/');
            if (Array.isArray(response.data)) {
                setCategories(buildCategoryTree(response.data));
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            toast.error('خطا در دریافت دسته‌بندی‌ها');
            console.error('Error fetching categories:', error);
        }
    };

    const buildCategoryTree = (categories) => {
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = { ...category, children: [] };
        });
        const tree = [];
        categories.forEach(category => {
            if (category.parent_id) {
                categoryMap[category.parent_id].children.push(categoryMap[category.id]);
            } else {
                tree.push(categoryMap[category.id]);
            }
        });
        return tree;
    };

    const createCategory = async () => {
        try {
            await axiosInstance.post('padmin/category/create/', newCategory);
            fetchCategories();
            setNewCategory({ title: '', parent: '' });
            toast.success('دسته‌بندی جدید با موفقیت ایجاد شد');
        } catch (error) {
            toast.error('خطا در ایجاد دسته‌بندی');
            console.error('Error creating category:', error);
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            await axiosInstance.delete(`padmin/category/${categoryId}/`);
            fetchCategories();
            toast.success('دسته‌بندی با موفقیت حذف شد');
        } catch (error) {
            toast.error('خطا در حذف دسته‌بندی');
            console.error('Error deleting category:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const renderCategoryTree = (categories) => {
        return categories.map(category => (
            <li key={category.id}>
                <div className="p-4 border rounded-lg flex flex-row justify-between dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-2">
                    <div className={"flex flex-col"}>
                        <p className="text-lg font-semibold">{category.title}</p>
                        {category.parent_title && <p className="text-sm text-gray-400">والد: {category.parent_title}</p>}
                    </div>
                    <button
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-700"
                        onClick={() => deleteCategory(category.id)}
                    >
                        حذف
                    </button>
                </div>
                {category.children.length > 0 && (
                    <ul className="ml-6">{renderCategoryTree(category.children)}</ul>
                )}
            </li>
        ));
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">دسته‌بندی‌ها</h1>
            <ul>
                {categories.length > 0 ? (
                    renderCategoryTree(categories)
                ) : (
                    <li className="text-center p-4">هیچ دسته‌بندی موجود نیست</li>
                )}
            </ul>
            <div className="mt-6 p-4 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <h2 className="text-xl font-semibold mb-2">افزودن دسته‌بندی جدید</h2>
                <input
                    type="text"
                    name="title"
                    value={newCategory.title}
                    onChange={handleInputChange}
                    placeholder="نام دسته‌بندی"
                    className="p-2 mb-2 rounded border text-black dark:text-white dark:bg-gray-600 dark:border-gray-600 w-full"
                />
                <select
                    name="parent"
                    value={newCategory.parent}
                    onChange={handleInputChange}
                    className="p-2 mb-2 rounded border text-black dark:text-white dark:bg-gray-600 dark:border-gray-600 w-full"
                >
                    <option value="">انتخاب دسته‌بندی اصلی</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.title}
                        </option>
                    ))}
                </select>
                <button
                    onClick={createCategory}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700 w-full"
                >
                    افزودن
                </button>
            </div>
        </div>
    );
};

export default Page;
