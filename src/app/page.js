import Image from "next/image";
import SliderCircle from "@/components/slider_circle";
import Auto from "@/components/silder_auto";
import PosterB1 from "@/components/poster_b1";
import S_product2 from "@/components/silder product 2 ";
import S_product1 from "@/components/silder product3";
import Tile from "@/components/tile";

export const generateMetadata = () => {
    return {
        title: "فروشگاه میدزی",
        description: "فروشگاه میدزی: بهترین محصولات با کیفیت بالا",
        keywords: ["فروشگاه", "لباس", "بازار آنلاین", "میدزی"],
        authors: [{ name: "midzi Store" }],
        openGraph: {
            title: "فروشگاه میدزی",
            description: "فروشگاه میدزی: بهترین محصولات با کیفیت بالا",
            type: "website",
            url: "https://www.midzi.ir",
            images: [
                {
                    url: "https://www.midzi.ir/logo.png",
                    alt: "midzi Store Logo",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "فروشگاه میدزی",
            description: "فروشگاه میدزی: بهترین محصولات با کیفیت بالا",
            images: ["https://www.midzi.com/logo.png"],
        },
        icons: {
            icon: "favicon.ico",
        },
        other: {
             "enamad" :"52146677",

        },
    };
};

export default function Home() {
    return (
        <>

            <div className="max-w-[1440px] w-full 2xl:mx-auto ">
                {/* Main Content Section */}
                <div className="flex flex-col-reverse 2xl:flex-row xl:flex-row mt-16">
                    <Auto />
                </div>
                <Tile />

                {/* Product Sections */}
                <S_product2 />
                <S_product1 />
            </div>
        </>
    );
}
