import React from 'react';
import UserCart from "@/components/user/user_cart";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | سبد خرید ',
        description: 'سبد خرید کاربر ' ,
    };
};
const Page = () => {
    return (
        <>
         <UserCart/>
        </>
    );
};

export default Page;