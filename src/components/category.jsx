import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [open, setOpen] = useState(false); // Add state for toggling the menu
    const menuRef = useRef(null); // Add a ref for the menu
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://midzi.liara.run/products/category/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    const handleSubcategoryClick = (subcategoryTitle) => {
        router.push(`/search?category=${encodeURIComponent(subcategoryTitle)}`);
        setOpen(false);
    };
    const handleSubcategoryClick1 = (subcategoryTitle) => {
        router.push(`/search?category=${encodeURIComponent(subcategoryTitle)}`);
        setOpen(false);
    };

    return (
        <>
            <div className="font-awsome cursor-pointer bg-myblue w-10 h-10 rounded-full justify-center items-center flex text-white select-none lg:hidden text-xl" onClick={() => setOpen((prev) => !prev)}>
                {open ? `` : ``}
            </div>
            <div ref={menuRef}>
                {open && (
                    <div
                        className="absolute md:hidden font-sans text-xl z-50 dark:bg-navblueD dark:text-text_w left-0 top-16 h-[calc(100vh-100px)] bg-navblue w-full mt-4 flex flex-col items-center justify-start gap-8">
                        <div
                            className={"border-b-2 w-full border-stone-400 flex flex-row py-4 px-4 cursor-pointer select-none"}>
                            <div
                                className="w-full px-3 flex justify-between font-sans_b  cursor-pointer"
                                onClick={() => {
                                    router.push(`/search?discount=true`);
                                    setOpen(false);
                                }}>
تخفیف ها                            </div>

                        </div>
                        <div
                            className={"border-b-2 w-full border-stone-400 flex flex-row py-2 px-4 cursor-pointer select-none"}>
                            <div
                                className="w-full px-3 flex justify-between font-sans_b  cursor-pointer"
                                onClick={() => {
                                    router.push(`/search?search=`);
                                    setOpen(false);
                                }}>
                                همه محصولات
                            </div>

                        </div>
                        {categories.filter(cat => cat.parent === null).map((category) => (
                            <div key={category.id} className="w-full ">
                                <div
                                    className={"border-b-2 border-stone-400 flex flex-row py-2 px-4 cursor-pointer select-none"}>
                                    <div
                                        className="w-full px-3 flex justify-between font-sans_b  cursor-pointer"
                                        onClick={() => handleSubcategoryClick1(category.id)}>
                                        {category.title}
                                    </div>
                                    <span onClick={() => toggleCategory(category)}
                                          className="font-awsome">{expandedCategory === category ? '' : ''}</span>
                                </div>
                                <div
                                    className={`transition-all flex flex-col gap-4 duration-300 ease-in-out ${expandedCategory === category ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    {categories.filter(cat => cat.parent === category.id).map((subcategory) => (
                                        <div key={subcategory.id}
                                             className="w-full flex items-center justify-start gap-3 font-sans_b border-b-2 border-stone-400 cursor-pointer px-12 py-2 "
                                             onClick={() => handleSubcategoryClick(subcategory.id)}>
                                            <span className="font-awsome"></span> {subcategory.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Category;
