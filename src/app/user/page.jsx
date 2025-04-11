import React from 'react';
import User_detail from "@/components/user/user_detail";

export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | پنل کاربر ',
        description: 'پنل اطلاعات کاربری ' ,
    };
};

const Page = () => {
    return (
        <>
          <User_detail/>
        </>
    );
};

export default Page;