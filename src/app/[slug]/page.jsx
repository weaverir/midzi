"use client";
import React, { useEffect, useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { CartContext } from "@/lib/cartAuth";
import { AuthContext } from "@/lib/loginauth";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import SliderCircle from "@/components/slider_circle";
import { BounceLoader } from "react-spinners";

function SinglePage() {
    const { fetchCartItemCount } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [price, setPrice] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(null);
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const productName = pathname.split("/").pop();
        if (productName) {
            fetchProductDetails(productName);
        } else {
            console.error("نام محصول در URL موجود نیست.");
        }
    }, [pathname]);

    const fetchProductDetails = async (name) => {
        try {
            const response = await axiosInstance.get(`/products/${name}`);
            setProduct(response.data);
            setPrice(response.data.price);
            setDiscountPercentage(response.data.discount_percentage);
            setDiscountedPrice(response.data.discounted_price);
        } catch (error) {
            console.error("خطا در دریافت جزئیات محصول:", error);
            toast.error("خطا در دریافت جزئیات محصول.");
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        updateAvailableSizes(color);
        updatePriceAndVariantId(color, selectedSize);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        updatePriceAndVariantId(selectedColor, size);
    };

    const updateAvailableSizes = (color) => {
        if (product) {
            const sizesForColor = product.variants
                .filter((variant) => variant.color.name === color.name)
                .map((variant) => variant.size)
                .filter(
                    (value, index, self) => self.findIndex((v) => v.name === value.name) === index
                ); // Ensure only unique sizes
            setAvailableSizes(sizesForColor);
        }
    };

    const updatePriceAndVariantId = (color, size) => {
        if (color && size && product) {
            const variant = product.variants.find(
                (variant) =>
                    variant.color.name === color.name &&
                    variant.size.name === size.name
            );
            if (variant) {
                setPrice(variant.price);
                setDiscountPercentage(variant.discount_percentage);
                setDiscountedPrice(variant.discounted_price);
                setSelectedVariantId(variant.id);
                console.log("شناسه نوع انتخابی:", variant.id);
            } else {
                console.log("نوع مطابق با رنگ و اندازه انتخاب شده موجود نیست.");
            }
        }
    };

    const handleAddToCart = () => {
        if (!selectedVariantId) {
            toast.error("لطفاً هم رنگ و هم اندازه را انتخاب کنید.");
            return;
        }

        const accessToken = localStorage.getItem("access");
        const refreshToken = localStorage.getItem("refresh");

        if (!accessToken || !refreshToken) {
            toast.error("شما باید وارد شوید تا بتوانید آیتم ها را به سبد خرید اضافه کنید.");
            router.push("/login");
            return;
        }

        const basketId = localStorage.getItem("basket");
        if (!basketId) {
            toast.error("شناسه سبد خرید پیدا نشد. لطفاً دوباره وارد شوید.");
            router.push("/login");
            return;
        }

        const payload = {
            product_variant_id: selectedVariantId,
            quantity: quantity,
        };

        axiosInstance
            .post(`/accounts/basket/${basketId}/items/`, payload)
            .then((response) => {
                console.log("سبد خرید ذخیره شد", response.data);
                toast.success("آیتم به سبد خرید اضافه شد.");
                fetchCartItemCount(); // Update cart item count
            })
            .catch((error) => {
                console.error("خطا در ذخیره سبد خرید:", error);
                toast.error("خطا در ذخیره سبد خرید.");
            });
    };

    const handleQuantityChange = (operation) => {
        setQuantity((prevQuantity) => {
            if (operation === "increment") {
                return prevQuantity + 1;
            }
            if (operation === "decrement" && prevQuantity > 1) {
                return prevQuantity - 1;
            }
            return prevQuantity;
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><BounceLoader color="#505DB1" size={60} /></div>;
    }

    if (!product) {
        return <div className="text-center text-xl mt-10">محصول پیدا نشد.</div>;
    }

    return (
        <>
            <div className="bg-navblue dark:bg-navblueD dark:text-text_w font-sans_b rounded-2xl mx-auto w-[95%] lg:w-[80%] xl:w-[70%] my-4 p-4">
                <div className="flex flex-col gap-9 lg:flex-row justify-between items-center">
                    <div className="w-full lg:w-2/5 mb-4 lg:mb-0">
                        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                            {[product.thumbnail, ...product.images.map(image => image.image)].map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="w-full lg:w-3/5 lg:pl-8">
                        <div className="bg-white dark:bg-bgdark dark:text-text_w rounded-xl shadow-lg p-4 mb-4">
                            <div className="text-black dark:text-text_w font-semibold text-2xl">{product.name}</div>
                            <div className="text-sm text-text_b">{product.category_name}</div>
                            {discountPercentage ? (
                                <div className="mt-2">
                                    <span className="text-xl text-red-600 font-semibold ml-2">
                                        {discountedPrice?.toLocaleString()} تومان
                                    </span>
                                    <span className="text-md text-red-600 font-semibold ml-2">
                                        ({discountPercentage}% تخفیف)
                                    </span>
                                    <span className="text-xl line-through">
                                        {price?.toLocaleString()} تومان
                                    </span>
                                </div>
                            ) : (
                                <div className="text-xl dark:text-text_w font-semibold mt-2">
                                    {price?.toLocaleString()} تومان
                                </div>
                            )}
                        </div>
                        <div className="bg-white dark:bg-bgdark dark:text-text_w rounded-xl shadow-lg p-4 mb-4">
                            <p className="text-black dark:text-text_w font-semibold text-2xl mb-2">رنگ بندی</p>
                            <div className="flex justify-center gap-3 px-3">
                                {product.variants
                                    .map((variant) => variant.color)
                                    .filter(
                                        (value, index, self) =>
                                            value && self.findIndex((v) => v.name === value.name) === index
                                    )
                                    .map((color, index) => (
                                        <div key={index} className="flex flex-col cursor-pointer" onClick={() => handleColorChange(color)}>
                                            <div
                                                className={`rounded-tr-xl rounded-tl-xl border-t-2 border-l-2 border-r-2 h-10 w-20 ${
                                                    selectedColor && selectedColor.name === color.name
                                                        ? "border-t-green-500 border-l-green-500 border-r-green-500"
                                                        : ""
                                                }`}
                                                style={{ backgroundColor: color.hex_code }}
                                            ></div>
                                            <div
                                                className={`rounded-br-xl dark:bg-bgdark border-b-2 border-l-2 border-r-2 dark:text-text_w rounded-bl-xl ${
                                                    selectedColor && selectedColor.name === color.name
                                                        ? "border-b-green-500 border-l-green-500 border-r-green-500"
                                                        : ""
                                                } shadow-2xl h-10 w-20 border-2 items-center justify-center flex`}
                                            >
                                                {color.name}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-bgdark dark:text-text_w rounded-xl shadow-lg p-4 mb-4">
                            <p className="text-black dark:text-text_w font-semibold text-2xl mb-2">سایز بندی</p>
                            <div className="flex justify-center gap-3 px-3">
                                {availableSizes.map((size, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-xl justify-center dark:bg-bgdark dark:text-text_w items-center flex bg-white h-10 w-20 border-2 cursor-pointer ${
                                            selectedSize && selectedSize.name === size.name ? "border-green-500" : ""
                                        }`}
                                        onClick={() => handleSizeChange(size)}
                                    >
                                        {size.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-bgdark dark:text-text_w rounded-xl shadow-lg p-4 mb-4">
                            <p className="text-black dark:text-text_w font-semibold text-2xl mb-2">تعداد</p>
                            <div className="flex justify-center items-center gap-3">
                                <button className="px-2 py-1 border rounded-lg shadow-lg" onClick={() => handleQuantityChange("decrement")}>
                                    -
                                </button>
                                <span className="text-xl">{quantity}</span>
                                <button className="px-2 py-1 border rounded-lg shadow-lg" onClick={() => handleQuantityChange("increment")}>
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center mx-2 mt-4">
                            <button
                                className="bg-myblue text-text_w rounded-full w-[150px] h-[40px] shadow-lg"
                                onClick={handleAddToCart}
                            >
                                اضافه به سبد خرید
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-9 bg-white dark:bg-bgdark rounded-2xl p-2 my-2 justify-between items-start">
                    <h2 className="text-2xl">توضیحات محصول</h2>
                    <div className="text-black  dark:text-text_w font-semibold text-xl">{product.description}</div>
                </div>
            </div>
        </>
    );
}

export default SinglePage;
