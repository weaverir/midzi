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

    return (
        <>
            <div className="font-awsome cursor-pointer lg:hidden text-xl" onClick={() => setOpen((prev) => !prev)}>
                {open ? `` : ``}
            </div>
            <div ref={menuRef}>
                {open && (
                    <div
                        className="absolute md:hidden font-sans_b z-50 dark:bg-navblueD dark:text-text_w left-0 top-16 h-[calc(100vh-100px)] bg-navblue w-full mt-4 flex flex-col items-center justify-center gap-8">
                        {categories.filter(cat => cat.parent === null).map((category) => (
                            <div key={category.id} className="w-full">
                                <div className="w-full px-3 flex justify-between font-sans_b border-b-2 cursor-pointer"
                                     onClick={() => toggleCategory(category)}>
                                    {category.title} <span className="font-awsome">{expandedCategory === category ? '' : ''}</span>
                                </div>
                                <div
                                    className={`transition-all flex flex-col gap-4 duration-300 ease-in-out ${expandedCategory === category ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    {categories.filter(cat => cat.parent === category.id).map((subcategory) => (
                                        <div key={subcategory.id}
                                             className="w-full flex items-center justify-between font-sans_b border-b-2 cursor-pointer px-12 py-2 "
                                             onClick={() => handleSubcategoryClick(subcategory.title)}>
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
