"use client"
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';



// import required modules
import { Pagination } from 'swiper/modules';
import Image from "next/image";

export default function S_product2() {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
    return (

        <div className="my-5">
            <div className=" flex flex-row my-5 ">
                <div className='text-3xl mx-5 flex justify-center items-center'> محصولات</div>
                <Image src='/pattern2.png' alt="Description of image" layout="responsive" width={100} height={100}
                       objectFit="cover"></Image>
            </div>
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className='flex select-none w-[100%]  flex-row gap-4 scroll-auto   overflow-x-auto w-100%  '>

                <div className="h-[350px] min-w-56  bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56 w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>
                <div className="h-[350px] min-w-56  w-56 bg-myblue rounded-xl flex flex-col justify-between">
                    <div className='flex flex-col justify-start '>
                        <div
                            className='h-[40px] w-[40px] font-awsome bg-navblue text-text_b flex items-center justify-center mt-4 rounded-xl mr-4'>
                        </div>
                    </div>
                    <div className="w-[180px] h-[55px] bg-navblue mx-auto mb-4 rounded-xl "></div>
                </div>


            </div>


        </div>

    )
        ;
}
