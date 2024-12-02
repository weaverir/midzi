"use client"
import React, { useRef, useState } from 'react';
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Pagination } from 'swiper/modules';


// Import Swiper styles


// import required modules

export default function SliderCircle() {
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
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className='flex select-none scrollbar scrollbar-thumb-rounded-full scroll-on-hover:hover  hover: scroll-on-hover hover:overflow-y-scroll scrollbar-thumb-rounded-full flex-row gap-3 scroll-auto scrollbar-corner-navblue scrollbar-thumb-navblue scrollbar-thumb-navblue overflow-x-auto w-100% overflow-hidden '>

            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>
            <div className="flex select-none flex-col justify-center items-center">
                <div className="rounded-full bg-amber-400 w-[100] h-[100px] mb-1"></div>
                <div className="text-text_b ">نام محصول</div>
            </div>


        </div>
    );
}
