"use client";
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Auto = () => {
    const router = useRouter();

    const handleClick = (category) => {
        router.push(`/search?category=${category}`);
    };

    return (
        <div className="w-[100%] mb-4 rounded-2xl">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className} w-2 h-2 bg-white rounded-full mx-1"></span>`;
                    },
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div
                        className="relative pb-[50%] h-0 mx-2 rounded-2xl overflow-hidden cursor-pointer"
                        onClick={() => handleClick(15)}
                        style={{
                            backgroundImage: "url('/s1.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative pb-[50%] h-0 mx-2 rounded-2xl overflow-hidden cursor-pointer"
                        onClick={() => handleClick(14)}
                        style={{
                            backgroundImage: "url('/s2.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default Auto;
