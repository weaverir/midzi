import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Footer1 = () => {
    const router = useRouter();
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://midzi.liara.run/products/category/');
            setCategories(response.data); // Assuming the response is an array of categories
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <div className={"mt-4"}>
            <div className="bg-myblue w-full p-8 gap-32 font-sans_b flex flex-col md:flex-row md:justify-center">
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">دسترسی سریع</h2>
                    <div className="text-xl cursor-pointer" onClick={() => router.push('/')}>خانه</div>
                    <div className="text-xl cursor-pointer" onClick={() => setShowCategories(!showCategories)}>محصولات</div>
                    {showCategories && categories && Array.isArray(categories) && (
                        <div className="ml-4 mt-2">
                            {categories.map((category, index) => (
                                <div key={index} className="text-lg cursor-pointer" onClick={() => router.push(`/search?category=${category.title}`)}>
                                    {category.title}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-xl cursor-pointer" onClick={() => router.push('/login')}>ورود</div>
                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">مجوز ها</h2>
                    <div className=" h-32 w-36" style={{
                        backgroundImage: 'url(/rezi.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}></div>
                    <div className=" h-32 w-36" style={{
                        backgroundImage: 'url(/enamad.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}></div>
                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">ارتباط با ما</h2>
                    <div><span className={"font-awsome"}></span> تلفن : 04142051111</div>
                    <div><span className={"font-awsome"}></span>  آدرس : آذربایجان شرقی - هادیشهر - ادامه </div>

                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">ارتباط با ما</h2>
                    <div className={"items-center"}><span className={"font-awsome_b my-2 text-3xl"}></span> اینستاگرام
                    </div>
                    <div className={"items-center"}><span className={"font-awsome_b my-2 text-3xl"}></span> تلگرام
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Footer1;
