"use client"
import React from 'react';
import Image from "next/image";


const CartModal = () => {
    const CartItem = true ;

    return (
        <div className=" w-max absolute p-4 top-12 z-50 left-0 bg-navblue rounded-xl text-text_b flex flex-col gap-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  ">
            {!CartItem ? (<div className="flex justify-center items-center">ثبت خرید خالی است </div>) : (<>
                <h2 className='text-xl'>سبد خرید</h2>
                <div className='flex justify-center items-center flex-col gap-4 '>
                    <div className="flex gap-4 bg-white rounded-xl p-4 ">
                        <Image src='/pro.png' alt='' height={140} width={72} className='object-cover rounded'></Image>
                        <div className="flex flex-col justify-between w-full">
                            {/*top*/}
                            <div className=''>
                                {/*title*/}
                                <div className="items-center flex justify-between gap-8">
                                    <h3 className='font-semibold'>نام محصول</h3>
                                    <div className='p-1 bg-myblue text-text_w rounded-xl'>39 هزار تومن</div>
                                </div>
                                {/*description*/}
                                <div className='text-sm'>
                                    موجود
                                </div>
                            </div>
                            {/*bottom*/}
                            <div className='flex justify-between text-sm'>
                                <span> تعداد 1</span>
                                <span className='text-blue-500'>حذف</span>
                            </div>
                            {/*top*/}

                        </div>
                    </div>
                    <div className="flex gap-4 bg-white rounded-xl p-4">
                        <Image src='/pro.png' alt='' height={140} width={72} className='object-cover rounded'></Image>
                        <div className="flex flex-col justify-between w-full">
                            {/*top*/}
                            <div className=''>
                                {/*title*/}
                                <div className="items-center flex justify-between gap-8">
                                    <h3 className='font-semibold'>نام محصول</h3>
                                    <div className='p-1 bg-myblue text-text_w rounded-xl'>39 هزار تومن</div>
                                </div>
                                {/*description*/}
                                <div className='text-sm'>
                                    موجود
                                </div>
                            </div>
                            {/*bottom*/}
                            <div className='flex justify-between text-sm'>
                                <span> تعداد 1</span>
                                <span className='text-blue-500'>حذف</span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="">
                    <div className='flex items-center justify-between text-sm bg-white p-4 rounded-lg'>
                        <span>جمع</span>
                        <span className='bg-myblue p-1 rounded-lg text-text_w'>78 هزار تومن</span>
                    </div>
                    <p className='text-sm mt-2 mb-4'> توضیحات توضیحات توضیحات توضیحات توضیحات</p>
                    <div className='flex  justify-between text-sm'>
                        <button className='bg-myblue rounded-lg p-1 text-text_w '>مشاهده سبد</button>
                        <button className="bg-myblue rounded-lg p-1 text-text_w "> تکمیل سفارش </button>
                    </div>
                </div>
            </> )}
        </div>
    );
};

export default CartModal;