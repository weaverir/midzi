"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import { toast } from 'react-hot-toast';
import Image from "next/image";
import { useDarkMode } from "@/context/DarkModeContext";


const Search = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const queryRef = useRef('');
    const prevQueryRef = useRef('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const searchRef = useRef();
    const dropdownRef = useRef();
    const { darkMode, toggleDarkMode } = useDarkMode();

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');

        if (name) {
            router.push(`/search?search=${name}`);
            setQuery('');
            setDropdownVisible(false);
        }
    };

    const fetchResults = async () => {
        if (queryRef.current !== prevQueryRef.current) {
            setLoading(true);
            try {
                const response = await axios.get('https://midzi.liara.run/search/', {
                    params: { search: queryRef.current },
                });

                setResults(response.data.results.products);
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
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchResults();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !searchRef.current.contains(event.target)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex-row font-sans_b gap-8  relative">
            <form onSubmit={handleSearch} className=" hidden lg:flex flex-row rounded" ref={searchRef}>
                <input
                    type="text"
                    value={query}
                    name="name"
                    placeholder="دنبال چی میگردی ؟"
                    className="flex flex-1 shadow rounded-full dark:bg-bgdark bg-white mx-4 placeholder:flex placeholder:justify-center placeholder:items-center"
                    onChange={handleInputChange}
                    autoComplete="off"
                />
                <button className="font-awsome bg-myblue select-none text-text_w rounded-full w-[40px] h-[40px]">
                    
                </button>
            </form>
            <div
                className=" flex cursor-pointer lg:hidden"
                onClick={() => router.push(`/`)}
                style={{
                    backgroundImage: darkMode ? "url('/logod.png')" : "url('/logo.png')",
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '50px',
                    width: '100px'
                }}
            />
            {loading && query ? (
                <div
                    ref={dropdownRef}
                    className="w-[350px] dark:bg-navblueD dark:text-text_w absolute top-12 h-[500px] -right-10 z-50 bg-navblue rounded-xl shadow-2xl p-2 flex justify-center items-center"
                >
                    <BounceLoader color="#505DB1"/>
                </div>
            ) : dropdownVisible && results.length > 0 && query ? (
                <div
                    ref={dropdownRef}
                    className="w-[350px] dark:bg-navblueD dark:text-text_w absolute overflow-y-auto h-[500px] top-12 -right-10 z-50 bg-navblue rounded-xl shadow-2xl p-2 gap-3"
                >
                    <p className="text-2xl font-semibold text-text_b mb-2 mx-2">نتایج</p>
                    {results.map((item) => (
                        <div
                            key={item.id}
                            className="flex dark:bg-bgdark dark:text-text_w gap-4 bg-white rounded-xl p-4 mb-3 cursor-pointer"
                            onClick={() => handleItemClick(item.name)}
                        >
                            <div
                                className="h-24 w-24 bg-cover bg-center rounded-xl rounded"
                                style={{backgroundImage: `url(${item.thumbnail})`}}
                            ></div>
                            <div className="flex flex-col justify-between w-full">
                                <div>
                                    <div className="items-center flex justify-between gap-8">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        {item.discounted_price && item.discounted_price < item.price ? (
                                            <div className={"flex flex-col bg-myblue rounded-xl p-2 "}>
                                                <span
                                                    className="text-red-600 text-sm font-bold">{item.discounted_price?.toLocaleString()} تومان</span>
                                                <span
                                                    className="line-through  text-sm text-gray-400 ml-2">{item.price?.toLocaleString()} تومان</span>
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
                    className="w-[250px] dark:bg-navblueD dark:text-text_w absolute top-12 right-0 z-50 bg-navblue rounded-xl shadow-2xl p-2">
                    No results found
                </div>
            ) : null}
        </div>
    );
};

export default Search;
