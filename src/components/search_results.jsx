"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { BounceLoader } from "react-spinners";
import { toast } from 'react-hot-toast';

const useURLParams = () => {
    const [params, setParams] = useState({});
    const searchParams = useSearchParams();

    useEffect(() => {
        const queryParams = {};
        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });
        setParams(queryParams);
    }, [searchParams]);

    return params;
};

const SearchResults = () => {
    const params = useURLParams();
    const [maxPrice, setMaxPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const router = useRouter();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        current_page: 1,
        total_pages: 1,
        page_range: []
    });

    useEffect(() => {
        const fetchResults = async () => {
            if (Object.keys(params).length > 0) {
                setLoading(true);
                try {
                    const response = await axios.get('https://midzi.liara.run/search/', { params });
                    setResults(response.data.results.products || []);
                    setMinPrice(response.data.results.min_price);
                    setMaxPrice(response.data.results.max_price);
                    setPagination({
                        count: response.data.count,
                        next: response.data.next,
                        previous: response.data.previous,
                        current_page: response.data.current_page,
                        total_pages: response.data.total_pages,
                        page_range: response.data.page_range
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Error fetching data.');
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchResults();
    }, [params]);

    const handleProductClick = (productName) => {
        const formattedName = productName.replace(/\s+/g, '-');
        router.push(`/${formattedName}`);
    };

    const handlePageChange = (page) => {
        const newParams = { ...params, page };
        router.push(`/search?${new URLSearchParams(newParams).toString()}`);
    };

    return (
        <div className="bg-navblue dark:bg-navblueD dark:text-text_w rounded-2xl flex flex-col justify-center mx-2 p-6">
            <div className="bg-white dark:bg-bgdark dark:text-text_w rounded-2xl grid gap-6 justify-center items-center p-4 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
                {loading ? (
                    <BounceLoader color="#505DB1" />
                ) : (
                    results.length > 0 ? (
                        results.map((item) => (
                            <div
                                key={item.id}
                                className="h-[350px] font-sans min-w-56 max-w-56 bg-myblue rounded-xl flex flex-col justify-between cursor-pointer bg-cover bg-center"
                                onClick={() => handleProductClick(item.name)}
                                style={{ backgroundImage: `url(${item.thumbnail})` }}
                            >
                                <div className="flex flex-col justify-start bg-gray-900 bg-opacity-50 rounded-t-xl">
                                    <div className="h-[40px] w-[40px] font-awsome bg-navblue dark:bg-bgdark dark:text-white text-text_b flex items-center justify-center mt-4 rounded-xl mr-4"></div>
                                </div>
                                <div className="w-[215px] font-sans text-sm dark:text-text_w text-black dark:bg-bgdark flex-row h-[60px] bg-navblue mx-auto mb-4 rounded-xl flex items-center justify-between p-2 gap-3">
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="font-sans_b text-[14px] ">{item.name}</div>
                                        <div
                                            className={"text-sm flex text-[10px] text-gray-600 justify-start"}>{item.category_name}</div>
                                    </div>
                                    {item.discounted_price && item.discounted_price < item.price ? (
                                        <div className={" flex flex-col text-[12px]"}>
                                            <span
                                                className="text-red-600 font-bold">{item.discounted_price?.toLocaleString()} تومان</span>
                                            <span
                                                className="line-through text-black dark:text-text_w ml-2">{item.price?.toLocaleString()} تومان</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm">{item.price?.toLocaleString()} تومان</div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>موردی برای &quot;{params.search}&quot; یافت نشد</div>
                    )
                )}
            </div>
            <div className="flex font-sans_b justify-center mt-4">
                <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={!pagination.previous}
                    className="bg-myblue text-text_w px-4 py-2 rounded mx-1"
                >
                    قبلی
                </button>
                {pagination.page_range.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`bg-myblue text-text_w px-4 py-2 rounded mx-1 ${page === pagination.current_page ? 'font-bold' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={!pagination.next}
                    className="bg-myblue text-text_w px-4 py-2 rounded mx-1"
                >
                    بعدی
                </button>
            </div>
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
};

export default Page;
