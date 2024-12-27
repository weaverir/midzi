"use client";
import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Auto = () => {
    return (
        <div className="w-[100%]  mb-4 rounded-2xl">
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
                    <div className="h-52 md:h-52 lg:h-64  xl:h-[350px] 2xl:h-96  bg-myblue mx-2 rounded-2xl"> slider 1 </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-52 md:h-52 lg:h-64  xl:h-[350px] 2xl:h-96 bg-mygblue mx-2 rounded-2xl"> slider 2 </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-52 md:h-52  lg:h-64 xl:h-[350px] 2xl:h-96 bg-mypurple mx-2 rounded-2xl"> slider 3 </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-52 md:h-52  lg:h-64 xl:h-[350px] 2xl:h-96 bg-mygblue mx-2 rounded-2xl"> slider 4 </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default Auto;
