"use client";
import React, { useRef, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Import required modules
import { Pagination } from 'swiper/modules';

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
            const response = await axiosInstance.get('https://midzi.liara.run/');
            setProducts(response.data.new_products);
            toast.success('Products fetched successfully!');
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products.');
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
        console.log(product.slug);
    };

    return (
        <div className="my-5 mx-4 font-sans">
            <div className="flex flex-row my-5">
                <div className='text-3xl w-[15%] ml-5 flex justify-center p-2 items-center'> جدیدترین ها</div>
                <div className="w-[85%] h-[30px] bg-cover bg-center overflow-hidden"
                     style={{backgroundImage: 'url(/pattern2.png)'}}></div>
            </div>
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className='flex select-none w-[100%] flex-row gap-4 scroll-auto overflow-x-auto'
            >
                {loading ? (
                    <div className="flex justify-center items-center h-64 w-full">
                        <p className="text-white">در حال بارگذاری...</p>
                    </div>
                ) : (
                    products.length > 0 ? (
                        products.map(item => (
                            <div
                                key={item.id}
                                className="h-[350px] font-sans min-w-56 max-w-56 bg-myblue rounded-xl flex flex-col justify-between cursor-pointer bg-cover bg-center"
                                onClick={() => handleProductClick(item)}
                                style={{backgroundImage: `url(http://midzi.liara.run${item.thumbnail})`}}
                            >
                                <div className="flex flex-col justify-start bg-gray-900 bg-opacity-50 rounded-t-xl">
                                    <div
                                        className="h-[40px] w-[40px] font-awsome bg-navblue dark:bg-bgdark dark:text-white text-text_b flex items-center justify-center mt-4 rounded-xl mr-4">
                                    </div>
                                </div>
                                <div
                                    className="w-[200px] font-sans text-sm dark:text-text_w text-black dark:bg-bgdark flex-row h-[55px] bg-navblue mx-auto mb-4 rounded-xl flex items-center justify-between p-2 gap-3">
                                    <div className="flex flex-col justify-center items-center">
                                        <div className="font-sans_b">{item.name}</div>
                                        <div>{item.category_name}</div>
                                    </div>
                                    {item.discounted_price && item.discounted_price < item.price ? (
                                        <div className={"text-sm flex flex-col"}>
                                            <span className="text-red-600 font-bold">{item.discounted_price?.toLocaleString()} تومان</span>
                                            <span className="line-through text-black dark:text-text_w ml-2">{item.price?.toLocaleString()} تومان</span>
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
        </div>
    );
}
