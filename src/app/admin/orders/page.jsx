import React from 'react';
import Admin_order from "@/components/admin/admin_order";
import Head from 'next/head';

export const metadata = {
    title: 'فروشگاه میدزی | پنل ادمین سفارشات',
    description: 'مدیریت سفارشات مدیر در این صفحه',
    viewport: 'width=device-width, initial-scale=1',
    charset: 'UTF-8',
    robots: 'noindex, nofollow',
    images: [
        {
            url: "https://www.midzi.ir/logo.png",
            alt: "midzi Store Logo",
        },
    ],
};

const Page = () => {
    return (
        <>
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta name="viewport" content={metadata.viewport} />
                <meta charSet={metadata.charset} />
                <meta name="robots" content={metadata.robots} />
                <link rel="icon" href="https://www.midzi.ir/logo.png" type="image/png" />
            </Head>
            <Admin_order />
        </>
    );
};

export default Page;
