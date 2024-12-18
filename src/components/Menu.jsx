"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";
import { BounceLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import Category from "@/components/category";

const Menu = () => {
    const [open, setOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const router = useRouter();
    const searchPopupRef = useRef(null);
    const menuRef = useRef(null);

    // Dynamic search states
    const [query, setQuery] = useState('');
    const queryRef = useRef('');
    const prevQueryRef = useRef('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [showProducts, setShowProducts] = useState(false);

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

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');

        if (name) {
            router.push(`/search?search=${name}`);
            setQuery('');
            setDropdownVisible(false);
            setSearchIsOpen(false);
        }
    };

    const fetchResults = async () => {
        if (queryRef.current !== prevQueryRef.current) {
            setLoading(true);
            try {
                const response = await axios.get('https://midzi.liara.run/search/', {
                    params: { search: queryRef.current },
                });

                setResults(response.data.results.products || []); // Ensure results are an array
                setDropdownVisible(true);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data.');

                setResults([]);
                setDropdownVisible(true);
                setLoading(false);
            }
            prevQueryRef.current = queryRef.current;
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (queryRef.current) {
                fetchResults();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);
    const handleInputChange = (event) => {
        const query = event.target.value;
        setQuery(query);
        queryRef.current = query;
        setDropdownVisible(true);
    };

    const handleItemClick = (productName) => {
        const formattedName = productName.replace(/\s+/g, '-');
        router.push(`/${formattedName}/`);
        setDropdownVisible(false);
        setSearchIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if ((menuRef.current && !menuRef.current.contains(event.target)) && (searchPopupRef.current && !searchPopupRef.current.contains(event.target))) {
            setOpen(false);
            setSearchIsOpen(false);
            setShowProducts(false);
        }
    };

    useEffect(() => {
        if (searchIsOpen || open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchIsOpen, open]);

    useEffect(() => {
        const handleRouteChange = () => {
            setOpen(false);
            setSearchIsOpen(false);
            setShowProducts(false);
            setExpandedCategory(null); // Close expanded category on route change
        };

        router.events?.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events?.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);

    const toggleCategory = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    return (
        <>
            <Category/>

            <div id="dark"
                 className="rounded-full w-10 h-10 select-none font-awsome bg-myblue justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 flex lg:hidden"
                 onClick={toggleDarkMode}>
                {darkMode ? '' : ''}
            </div>
            <div
                className="font-awsome cursor-pointer select-none lg:hidden text-xl bg-myblue rounded-full w-[40px] h-[40px] flex items-center justify-center text-text_w"
                onClick={() => setSearchIsOpen((prev) => !prev)}>
                
            </div>
            {searchIsOpen && (
                <div ref={searchPopupRef}
                     className="absolute z-50 left-0 dark:bg-navblueD dark:text-text_w top-16 h-[calc(100vh-100px)] bg-navblue w-full mt-4 text-text_b flex flex-col items-center justify-start gap-8">

                    <div className="flex-row gap-2 mt-4 flex z-50">
                        <button
                            className="font-awsome text-xl text-text_w bg-red-500 rounded-full w-[40px] h-[40px] flex items-center justify-center"
                            onClick={() => setSearchIsOpen(false)}>
                            
                        </button>
                        <form onSubmit={handleSearch} className='flex flex-row rounded'>
                            <input type="text" name="name" value={query} placeholder='دنبال چی میگردی ؟'
                                   className='flex font-sans_b  dark:bg-bgdark flex-1 dark:text-text_w shadow rounded-full bg-white mx-4 placeholder:flex placeholder:justify-center placeholder:items-center'
                                   onChange={handleInputChange} autoComplete="off"/>
                            <button type="submit"
                                    className='font-awsome bg-myblue text-text_w rounded-full w-[40px] h-[40px]'>
                            </button>
                        </form>
                    </div>

                    {loading && query ? (
                        <div
                            className="w-[350px] dark:bg-navblueD dark:text-text_w absolute top-28 h-[500px] z-50 bg-navblue rounded-xl shadow-2xl p-2 flex justify-center items-center">
                            <BounceLoader color="#505DB1"/>
                        </div>
                    ) : dropdownVisible && results.length > 0 && query ? (
                        <div
                            className="w-[350px] dark:bg-navblueD dark:text-text_w overflow-y-auto h-[500px] top-28 z-50 bg-navblue rounded-xl shadow-2xl p-2 gap-3">
                            <p className="text-2xl font-semibold text-text_b mb-2 mx-2">نتایج</p>
                            {results.map((item) => (
                                <div key={item.id}
                                     className="flex dark:bg-bgdark dark:text-text_w gap-4 bg-white rounded-xl p-4 mb-3 cursor-pointer"
                                     onClick={() => handleItemClick(item.name)}>
                                    <div className="h-24 w-24 bg-cover bg-center rounded"
                                         style={{backgroundImage: `url(${item.thumbnail})`}}></div>
                                    <div className="flex flex-col justify-between w-full">
                                        <div>
                                            <div className="items-center flex justify-between gap-8">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                {item.discounted_price && item.discounted_price < item.price ? (
                                                    <div className={"flex flex-col"}>
                                                        <span
                                                            className="text-red-600 font-bold">{item.discounted_price?.toLocaleString()} تومان</span>
                                                        <span
                                                            className="line-through text-gray-400 ml-2">{item.price?.toLocaleString()} تومان</span>
                                                    </div>
                                                ) : (
                                                    <div className="p-1 bg-myblue text-text_w rounded-xl">
                                                        {item.price?.toLocaleString()} تومان
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                {item.stock === 0 ? 'ناموجود' : 'موجود'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : dropdownVisible && results.length === 0 && query ? (
                        <div
                            className="w-[250px] dark:bg-navblueD dark:text-text_w absolute top-28 z-50 bg-navblue rounded-xl shadow-2xl p-2">
                            No results found
                        </div>
                    ) : null}
                </div>
            )}
        </>
    );
};

export default Menu;
