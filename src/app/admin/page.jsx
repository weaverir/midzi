import React from 'react';
import Admin_panel from "@/components/admin/admin_panel";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | پنل ادمین',
        description: 'پنل مدیریت سایت و ادمین',
    };
};
const Page = () => {
    return (
        <>
            <Admin_panel/>
        </>
    );
};

export default Page;