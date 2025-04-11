import React from 'react';
import Admin_settings from "@/components/admin/admin_settings";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | مدیریت سایت ',
        description: 'مدیریت سایت',
    };
};

const Page = () => {
    return (
        <>
          <Admin_settings/>
        </>
    );
};

export default Page;