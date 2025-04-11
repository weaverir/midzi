import React from 'react';
import Login from "@/components/login/login";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | ورود',
        description: 'صفحه ورود کاربران',
    };
};
const Page = () => {
    return (
        <>
          <Login/>
        </>
    );
};

export default Page;