import React from 'react';
import Product_slug from "@/components/admin/product_slug";

export const generateMetadata = async () => {
    return {
        title: 'فروشگاه میدزی | ویرایش محصولات ',
        description: 'پنل مدیریت کاربران ',
    };
};

const Page = () => {
    return (
        <>
            <Product_slug />
        </>
    );
};

export default Page;
