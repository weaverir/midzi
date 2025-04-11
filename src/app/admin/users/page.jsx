import React from 'react';
import Admin_users from "@/components/admin/admin_users";
export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | مدیریت کاربران ',
        description: 'پنل مدیریت کاربران ',
    };
};
const Page = () => {
    return (
        <>
          <Admin_users/>
        </>
    );
};

export default Page;