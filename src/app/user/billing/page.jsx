import React from 'react';
import User_billing from "@/components/user/user_billing";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | فیش واریز ',
        description: 'صفحه بعد از پرداخت ' ,
    };
};
const Page = () => {
    return (
        <>
         <User_billing/>
        </>
    );
};

export default Page;