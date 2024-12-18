"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const BotNav = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showSubcategories, setShowSubcategories] = useState(false);
    const [popupStyle, setPopupStyle] = useState({ top: 0, left: 0 });
    const router = useRouter();
    const popupRef = useRef();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://midzi.liara.run/products/category/');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('ارور در گرفتن دسته بندی ');
            }
        };

        fetchCategories();
    }, []);

    const buildCategoryList = (categories) => {
        const categoryMap = {};
        const categoryList = [];

        categories.forEach(category => {
            categoryMap[category.id] = { ...category, subcategories: [] };
        });

        categories.forEach(category => {
            if (category.parent_id) {
                categoryMap[category.parent_id].subcategories.push(categoryMap[category.id]);
            } else {
                categoryList.push(categoryMap[category.id]);
            }
        });

        return categoryList;
    };

    const categoryList = buildCategoryList(categories);
    const handleCategoryClick = (category) => {
        const categoryElement = document.getElementById(`category-${category.id}`);
        const rect = categoryElement.getBoundingClientRect();

        if (category.subcategories.length > 0) {
            setSelectedCategory(category);
            setPopupStyle({ top: rect.bottom, left: rect.left });
            setShowSubcategories(true);
        } else {
            router.push(`/search?category=${category.title}`);
        }
    };

    const closePopup = () => {
        setShowSubcategories(false);
        setSelectedCategory(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup();
            }
        };

        if (showSubcategories) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSubcategories]);
    return (
        <div className="relative font-sans_b w-[70%] mx-auto hidden lg:block">
            <div className="flex-row mx-auto items-center justify-between content-center max-w-[1200px] bg-navblue h-12 w-[80%] border-t dark:border-t-bgdark rounded-br-2xl rounded-bl-2xl dark:text-text_w dark:bg-navblueD">
                <ul className="flex flex-row items-center justify-start content-center gap-3 mx-3 font-sans_m dark:text-text_w">
                    <li onClick={() => setShowSubcategories(true)} className="cursor-pointer">دسته بندی</li>
                </ul>
            </div>

            {showSubcategories && (
                <div ref={popupRef} className="absolute top-16 left-1/2 transform bg-navblue -translate-x-1/2 w-full max-w-xl  dark:bg-navblueD p-4 rounded-lg shadow-lg z-50">
                    <button className="absolute top-2 right-2 text-black dark:text-text_w" onClick={closePopup}>✖</button>
                    <h2 className="text-lg font-bold mb-4 dark:text-text_w">محصولات</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="col-span-1 flex gap-3 flex-col w-[50%]">
                            {categoryList.map((category) => (
                                <li
                                    key={category.id}
                                    id={`category-${category.id}`}
                                    onClick={() => handleCategoryClick(category)}
                                    className="cursor-pointer bg-white dark:bg-bgdark rounded"
                                >
                                    {category.title} {category.subcategories.length > 0 && '◀'}
                                </li>
                            ))}
                        </ul>
                        {selectedCategory && selectedCategory.subcategories.length > 0 && (
                            <ul className="col-span-1 flex flex-col gap-3 border-r-2">
                                {selectedCategory.subcategories.map((subcategory) => (
                                    <li
                                        key={subcategory.id}
                                        onClick={() => router.push(`/search?category=${subcategory.title}`)}
                                        className="cursor-pointer bg-white dark:bg-bgdark rounded"
                                    >
                                        {subcategory.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotNav;
