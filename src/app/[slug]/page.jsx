import React from 'react';
import axios from 'axios';
import SlugDetail from "@/components/slug/slug_detail";

export const generateMetadata = async ({ params }) => {
    const productName = params.slug;

    try {
        const response = await axios.get(`https://midzi.liara.run/products/${productName}`);
        const product = response.data;
        return {
            title: `فروشگاه میدزی | ${product.name}`,
            description: product.description,
            openGraph: {
                images: [
                    {
                        url: product.thumbnail,
                        alt: product.name,
                    },
                ],
            },
        };
    } catch (error) {
        return {
            title: 'فروشگاه میدزی | جزئیات محصول',
            description: 'خطا در دریافت جزئیات محصول.',
        };
    }
};

const fetchProductDetails = async (productName) => {
    try {
        const response = await axios.get(`https://midzi.liara.run/products/${productName}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "خطا در دریافت جزئیات محصول.");
    }
};

const Page = async ({ params }) => {
    const productName = params.slug;
    let product;
    let error;

    try {
        product = await fetchProductDetails(productName);
    } catch (err) {
        error = err.message;
    }

    if (error) {
        return <div className="text-center text-xl mt-10">{error}</div>;
    }

    return (
        <>
            <SlugDetail product={product} />
        </>
    );
};

export default Page;
