"use client"
import React, { useRef, useState } from 'react';
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

            <div className=" w-[90%]   mx-5 xl:w-3/5  rounded-2xl">
            <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
        >
            <SwiperSlide>
                <div className="h-72 bg-myblue rounded-2xl"> silder 1 </div>
            </SwiperSlide>
                <SwiperSlide>
                    <div className="h-72 bg-mygblue rounded-2xl"> silder 2</div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-72 bg-mypurple rounded-2xl"> silder 3 </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="h-72 bg-mygblue rounded-2xl"> silder 4 </div>
                </SwiperSlide>

        </Swiper>
</div>
);
}

export default Auto;
