import React from 'react';
import User_order from "@/components/user/user_order";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | سفارشات کاربر ',
        description: 'پنل سفارشات کاربران ' ,
    };
};
const Page = () => {
    return (
        <>
<User_order/>
        </>
    );
};

export default Page;