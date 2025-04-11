import React from 'react';
import Admin_product from "@/components/admin/admin_product";

export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | ویرایش محصول',
        description: 'Manage products in the admin panel',
    };
};

const Page = () => {
    return (
        <>
            <Admin_product/>
        </>
    );
};

export default Page;
