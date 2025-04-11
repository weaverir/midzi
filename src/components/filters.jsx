"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'rc-slider/assets/index.css'; // Import the CSS for rc-slider
import Slider from 'rc-slider'; // Import rc-slider

const FilterSearch = () => {
    const router = useRouter();
    const [filter1, setFilter1] = useState(false);
    const [filter2, setFilter2] = useState(false);
    const [priceFilterOpen, setPriceFilterOpen] = useState(false); // State for price filter pop-up

    const filter1Ref = useRef(null);
    const filter2Ref = useRef(null);
    const priceFilterRef = useRef(null); // Ref for price filter pop-up

    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]); // State to store categories
    const [priceRange, setPriceRange] = useState([100000, 4000000]);
    const [size, setSize] = useState('');
    const [sizes, setSizes] = useState([]); // State to store sizes
    const [color, setColor] = useState('');
    const [colors, setColors] = useState([]); // State to store colors
    const [appliedPriceRange, setAppliedPriceRange] = useState(null); // State to store applied price range
    const handleClickOutside = (event) => {
        if (filter1Ref.current && !filter1Ref.current.contains(event.target)) {
            setFilter1(false);
        }
        if (filter2Ref.current && !filter2Ref.current.contains(event.target)) {
            setFilter2(false);
        }
        if (priceFilterRef.current && !priceFilterRef.current.contains(event.target)) {
            setPriceFilterOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Fetch categories, sizes, and colors from the API
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('https://midzi.liara.run/products/category/');
                setCategories(categoriesResponse.data);
                const colorsResponse = await axios.get('https://midzi.liara.run/products/color/');
                setColors(colorsResponse.data);
                const sizesResponse = await axios.get('https://midzi.liara.run/products/size/');
                setSizes(sizesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const updateURLParams = (newParams) => {
        const params = new URLSearchParams(window.location.search);
        Object.keys(newParams).forEach((key) => {
            if (newParams[key] !== null && newParams[key] !== '') {
                params.set(key, newParams[key]);
            } else {
                params.delete(key);
            }
        });

        // Update the URL with the query parameters
        router.push(`/search?${params.toString().replace(/\+/g, '%20')}`);
    };

    const handleSearch = () => {
        updateURLParams({
            category,
            size,
            color,
            ...appliedPriceRange && { price_min: appliedPriceRange[0], price_max: appliedPriceRange[1] }
        }
        );

        setFilter1(false)
    };

    const handleSort = (sortType) => {
        updateURLParams({ ordering: sortType });
        setFilter2(false);
    };

    const handleCategorySelect = (category) => {
        setCategory(category);
        // Close the category filter pop-up after selection
    };

    const handleSizeSelect = (size) => {
        setSize(size);
        // Close the size filter pop-up after selection
    };

    const handleColorSelect = (color) => {
        setColor(color);
        // Close the color filter pop-up after selection
    };

    const handlePriceApply = () => {
        setAppliedPriceRange(priceRange);
        updateURLParams({
            price_min: priceRange[0],
            price_max: priceRange[1],
            category,
            size,
            color
        });
        setPriceFilterOpen(false); // Close the price filter pop-up after applying
    };
    return (
        <div className="flex flex-col font-sans_b md:flex-row mx-2 justify-start gap-3 my-3 w-full md:w-2/3">
            {/* FilterSearch Component */}
            <div className="relative flex flex-col lg:px-2 w-full md:w-auto" ref={filter1Ref}>
                <div
                    className="w-full relative cursor-pointer flex flex-row bg-myblue rounded-xl select-none text-text_w gap-3 px-2 py-2"
                    onClick={() => setFilter1(!filter1)}>
                    <p className="font-awsome text-text_w text-xl"></p> فیلترها <p className="font-awsome text-text_w text-xl"></p>
                </div>
                {filter1 ? (
                    <div
                        className="absolute max-w-[300] dark:bg-navblueD dark:text-text_w flex flex-col z-50 top-12 right-0 p-5 bg-navblue text-text_b rounded-xl">
                        <div className="flex flex-col mb-4">
                            <label>دسته بندی</label>
                            <select value={category} onChange={(e) => handleCategorySelect(e.target.value)}
                                    className="rounded p-2 dark:bg-bgdark dark:text-text_w">
                                <option className={"dark:bg-bgdark dark:text-text_w"} value="">انتخاب دسته بندی</option>
                                {categories.map(cat => (
                                    <option className={"dark:bg-bgdark dark:text-text_w"} key={cat.id}
                                            value={cat.id}>{cat.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col  mb-4">
                            <label>رنگ</label>
                            <select
                                value={color}
                                onChange={(e) => handleColorSelect(e.target.value)}
                                className="rounded p-2 dark:bg-bgdark dark:text-text_w"
                                style={{maxHeight: '120px', overflowY: 'auto'}}
                                size={5} // Show only 5 options at a time
                            >
                                <option className={"dark:bg-bgdark dark:text-text_w"} value="">انتخاب رنگ</option>
                                {colors.map(c => (
                                    <option className={"dark:bg-bgdark dark:text-text_w"} key={c.id}
                                            value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col mb-4">
                            <label>سایز</label>
                            <select
                                value={size}
                                onChange={(e) => handleSizeSelect(e.target.value)}
                                className="rounded p-2 dark:bg-bgdark dark:text-text_w"
                                style={{maxHeight: '120px', overflowY: 'auto'}}
                                size={5} // Show only 5 options at a time
                            >
                                <option className={"dark:bg-bgdark dark:text-text_w"} value="">انتخاب سایز</option>
                                {sizes.map(s => (
                                    <option className={"dark:bg-bgdark dark:text-text_w"} key={s.id}
                                            value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>


                        <button className="bg-myblue rounded-2xl p-2 mt-2 text-text_w" onClick={handleSearch}>اعمال
                            فیلتر
                        </button>
                    </div>
                ) : null}
            </div>

            {/* Sort Component */}
            <div className="relative w-full md:w-auto" ref={filter2Ref}>
                <div
                    className="w-full flex flex-row cursor-pointer bg-myblue select-none rounded-xl text-text_w px-2 py-2"
                    onClick={() => setFilter2(!filter2)}>
                    <p className="font-awsome text-text_w text-xl"></p> مرتب سازی <p
                    className="font-awsome text-text_w text-xl"></p>
                </div>
                {filter2 ? (
                    <div
                        className="text-text_b absolute flex flex-col justify-center z-50 top-12 right-0 bg-navblue dark:bg-navblueD dark:text-text_w rounded-xl">
                        <ul className="cursor-pointer px-4 py-2 hover:bg-myblue hover:text-white hover:rounded-xl rounded-md"
                            onClick={() => handleSort('')}>جدیدترین
                        </ul>
                        <ul className="cursor-pointer px-4 py-2 hover:bg-myblue hover:text-white hover:rounded-xl rounded-md"
                            onClick={() => handleSort('-price')}>گرانترین
                        </ul>
                        <ul className="cursor-pointer px-4 py-2 hover:bg-myblue hover:text-white hover:rounded-xl rounded-md"
                            onClick={() => handleSort('price')}>ارزانترین</ul>
                    </div>
                ) : null}
            </div>

            {/* Price Filter Component */}
            <div className="relative w-full md:w-auto" ref={priceFilterRef}>
                <div
                    className="w-full flex flex-row cursor-pointer bg-myblue select-none rounded-xl text-text_w px-2 py-2"
                    onClick={() => setPriceFilterOpen(!priceFilterOpen)}>
                    <p className="font-awsome text-text_w text-xl"></p> فیلتر بر اساس قیمت <p className="font-awsome text-text_w text-xl"></p>
                </div>
                {priceFilterOpen ? (
                    <div className="absolute max-w-[350px] flex flex-col z-50 top-12 right-0 p-5 bg-navblue dark:bg-navblueD dark:text-text_w text-text_b overflow-hidden rounded-xl">
                        <label className="mb-2">بر اساس قیمت</label>
                        <Slider
                            range
                            className="custom-slider "
                            max={3000000}
                            min={0}
                            value={priceRange}
                            onChange={value => setPriceRange(value)}
                        />
                        <div className="flex flex-row gap-4 mt-2">
                            <div className="flex w-[50%] px-2 flex-col">
                                <label>تا:</label>
                                <input
                                    type="text"
                                    value={`${priceRange[1]} تومان`}
                                    readOnly
                                    className="rounded dark:bg-bgdark dark:text-text_w outline-none p-2"
                                />
                            </div>
                            <div className="flex w-[50%] px-2 flex-col">
                                <label>از:</label>
                                <input
                                    type="text"
                                    value={`${priceRange[0]} تومان`}
                                    readOnly
                                    className="rounded dark:bg-bgdark dark:text-text_w outline-none p-2"
                                />
                            </div>
                        </div>
                        <button className="bg-myblue rounded-2xl p-2 mt-2 text-text_w" onClick={handlePriceApply}>اعمال
                            قیمت
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FilterSearch;
