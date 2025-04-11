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
        <div className="mt-4 bg-myblue flex flex-col items-center">
            <div className="bg-myblue w-full p-8 gap-32 font-sans_b flex flex-col md:flex-row md:justify-center">
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">دسترسی سریع</h2>
                    <div className="text-xl cursor-pointer" onClick={() => router.push('/')}>خانه</div>
                    <div className="text-xl cursor-pointer" onClick={() => setShowCategories(!showCategories)}>محصولات</div>
                    {showCategories && categories && Array.isArray(categories) && (
                        <div className="ml-4 mt-2">
                            {categories.map((category, index) => (
                                <div key={index} className="text-lg cursor-pointer" onClick={() => router.push(`/search?category=${category.id}`)}>
                                    {category.title}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-xl cursor-pointer" onClick={() => router.push('/login')}>ورود</div>
                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">مجوز ها</h2>
                    <a referrerPolicy='origin' target='_blank'
                       href='https://trustseal.enamad.ir/?id=561926&Code=Nxo6gcAAdeBKXQ2IwIaCj04MNLhD4x3y'><img
                        referrerPolicy='origin'
                        src='https://trustseal.enamad.ir/logo.aspx?id=561926&Code=Nxo6gcAAdeBKXQ2IwIaCj04MNLhD4x3y'
                        alt='' style={{ cursor: 'pointer' , width:"150px"}} code='Nxo6gcAAdeBKXQ2IwIaCj04MNLhD4x3y'/></a>
                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">ارتباط با ما</h2>
                    <div><span className="font-awsome"></span> تلفن : 04142046236</div>
                    <div><span className="font-awsome"></span> آدرس : آذربایجان شرقی - هادیشهر - خیابان پارک شهر - جنب کوچه حسینی اقدم</div>
                    <div><span className="font-awsome"></span> کدپستی : 5431856543</div>
                    <div><span className="font-awsome"></span> موبایل : 09368962164</div>
                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                    <h2 className="text-2xl mb-4">شبکه های مجازی</h2>
                    <div className="items-center cursor-pointer select-none" onClick={() => router.push(`https://www.instagram.com/midzi.ir?igsh=ZzhzdGlzN3Q0NzEz`)}>
                        <span className="font-awsome_b my-2 text-3xl"></span> اینستاگرام
                    </div>
                    <div className="items-center">
                        <span className="font-awsome_b my-2 text-3xl"></span> تلگرام
                    </div>
                </div>
            </div>
            <div className="font-sans_b flex justify-center mb-20">
                <h2>طراحی شده توسط گروه DreaMix</h2>
            </div>
        </div>
    );
};

export default Footer1;
