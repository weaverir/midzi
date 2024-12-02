"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { BounceLoader } from 'react-spinners';

const Search = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const queryRef = useRef(''); // Store the latest query value
    const prevQueryRef = useRef(''); // Store the previous query value
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false); // State to manage dropdown visibility
    const searchRef = useRef();
    const dropdownRef = useRef(); // Reference for the dropdown

    const HandleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');

        if (name) {
            router.push(`/list?name=${name}`);
            setQuery("");
            setDropdownVisible(false);
        }
    };

    const fetchResults = async () => {
        // Only send the request if the query has changed
        if (queryRef.current !== prevQueryRef.current) {
            setLoading(true);
            const encodedQuery = queryRef.current;
            try {
                const response = await axios.get('https://midzi.liara.run/search/', {
                    params: { search: encodedQuery }
                });

                setResults(response.data.results.products);
                setDropdownVisible(true); // Show the dropdown when results are fetched
                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
                setResults([]);
                setDropdownVisible(true); // Show the dropdown even if no results
                setLoading(false);
            }
            // Update the previous query value
            prevQueryRef.current = queryRef.current;
        }
    };

    const handleInputChange = (event) => {
        const query = event.target.value;
        setQuery(query);
        queryRef.current = query; // Update the ref with the latest value
        setDropdownVisible(true); // Show the dropdown on input change
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchResults();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !searchRef.current.contains(event.target)) {
                setDropdownVisible(false); // Hide the dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="flex-row gap-8 hidden lg:flex relative">
                <form onSubmit={HandleSearch} className="flex flex-row rounded" ref={searchRef}>
                    <input
                        type="text"
                        value={query}
                        name="name"
                        placeholder="دنبال چی میگردی ؟"
                        className="flex flex-1 shadow rounded-2xl bg-white mx-4 placeholder:flex placeholder:justify-center placeholder:items-center"
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                    <button className="font-awsome bg-myblue text-text_w rounded-full w-[40px] h-[40px]">
                        
                    </button>
                </form>
                {loading && query ? (
                    <div ref={dropdownRef} className="w-[350px] absolute top-12 h-[500px] -right-10 z-50 bg-navblue rounded-xl shadow-2xl p-2 flex justify-center items-center">
                        <BounceLoader color="#505DB1" />
                    </div>
                ) : dropdownVisible && results.length > 0 && query ? (
                    <div ref={dropdownRef} className="w-[350px] absolute overflow-y-auto h-[500px] top-12 -right-10 z-50 bg-navblue rounded-xl shadow-2xl p-2 gap-3">
                        <p className="text-2xl font-semibold text-text_b mb-2 mx-2">نتایج</p>
                        {results.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white rounded-xl p-4 mb-3">
                                <Image src="/pro.png" alt="" height={140} width={72} className="object-cover rounded" />
                                <div className="flex flex-col justify-between w-full">
                                    <div className="">
                                        <div className="items-center flex justify-between gap-8">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <div className="p-1 bg-myblue text-text_w rounded-xl">{item.price} تومن</div>
                                        </div>
                                        <div className="text-sm">{item.stock === 0 ? 'ناموجود' : 'موجود'}</div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-blue-500 cursor-pointer">افزودن به سبد خرید</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : dropdownVisible && results.length === 0 && query ? (
                    <div className="w-[250px] absolute top-12 right-0 z-50 bg-navblue rounded-xl shadow-2xl p-2">
                        No results found
                    </div>
                ) : (
                    ''
                )}
            </div>
            <Image src="/logo.png" alt="" height={75} width={150} className="flex lg:hidden" />
        </>
    );
};

export default Search;
