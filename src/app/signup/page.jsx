import React from 'react';
import Signup from "@/components/signup/signup";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | ثبت نام',
        description: 'ثبت نام کاربران جدید',
    };
};
const Page = () => {
    return (
        <>
         <Signup/>
        </>
    );
};

export default Page;