"use client";
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';

export default function S_product1() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);  // Show loading screen
        try {
            const response = await axios.get('https://midzi.liara.run/');
            setProducts(response.data.new_products);
        } catch (error) {
            toast.error('خطا در دریافت محصول');
        } finally {
            setLoading(false);  // Hide loading screen
        }
    };

    const handleMouseDown = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - containerRef.current.offsetLeft);
            setScrollLeft(containerRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleProductClick = (product) => {
        // Handle product click event
        router.push(`/${product.slug}`);
    };

    const scrollLeftClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 200; // Adjust the scroll distance as needed
        }
    };

    const scrollRightClick = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 200; // Adjust the scroll distance as needed
        }
    };

    return (
        <div className="relative my-5 mx-4 font-sans">
            <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-navblue dark:bg-navblueD p-2 rounded-full shadow-md focus:outline-none mx-2 w-10 h-10 transition-transform duration-300 ease-in-out"
                onClick={scrollLeftClick}
            >
                ◀
            </button>
            <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-navblue dark:bg-navblueD p-2 rounded-full shadow-md mx-2 w-10 h-10 focus:outline-none transition-transform duration-300 ease-in-out"
                onClick={scrollRightClick}
            >
                ▶
            </button>
            <div className="flex flex-row my-5 justify-center items-center">
                <div className='text-xl lg:text-3xl w-[60%] md:w-[35%] lg:w-[30%] xl:w-[25%] font-sans_b ml-5 flex justify-start  p-2 items-center'> جدیدترین ها</div>
                <div className="w-[100%] bg-cover border-t-4 dark:border-navblue border-stone-500 bg-center overflow-hidden"></div>
            </div>
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className='flex select-none w-[100%] flex-row gap-4 no-scrollbar scroll-auto overflow-x-auto'
            >
                {loading ? (
                    <div className="flex justify-center items-center h-64 w-full">
                        <BounceLoader color="#505DB1" />
                    </div>
                ) : (
                    products.length > 0 ? (
                        products.map(item => (
                            <div
                                key={item.id}
                                className="h-[350px] font-sans_b min-w-56 max-w-56 bg-myblue rounded-xl flex flex-col justify-between cursor-pointer bg-cover bg-center"
                                onClick={() => handleProductClick(item)}
                                style={{ backgroundImage: `url(https://midzi.liara.run${item.thumbnail})` }}
                            >
                                <div className="flex flex-col justify-start bg-gray-900 bg-opacity-50 rounded-t-xl">
                                    <div className="h-[40px] w-[40px] font-awsome bg-navblue dark:bg-bgdark dark:text-white text-text_b flex items-center justify-center mt-4 rounded-xl mr-4"></div>
                                </div>
                                <div
                                    className="w-[215px] font-sans text-sm dark:text-text_w text-black dark:bg-bgdark flex-row h-[60px] bg-navblue mx-auto mb-4 rounded-xl flex items-center justify-between p-2 gap-3">
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
                        <p className="text-white">هیچ محصولی یافت نشد.</p>
                    )
                )}
            </div>
            <div className="flex justify-center my-5">
                <button
                    onClick={() => router.push('/search?search=')}
                    className="bg-navblue dark:bg-navblueD text-white py-2 px-4 rounded-full"
                >
                    نمایش همه
                </button>
            </div>
        </div>
    );
}
