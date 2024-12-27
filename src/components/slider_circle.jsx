"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter
import axios from 'axios';
import { toast } from 'react-hot-toast';  // Import toast from react-hot-toast
import { BounceLoader } from 'react-spinners';  // Import BounceLoader

export default function SliderCircle() {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragged, setDragged] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPosition, setScrollLeftPosition] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);  // State for loading screen
    const router = useRouter();  // Initialize router

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);  // Show loading screen
        try {
            const response = await axios.get('https://midzi.liara.run/');
            setProducts(response.data.random);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products.');
        } finally {
            setLoading(false);  // Hide loading screen
        }
    };

    const handleMouseDown = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            setDragged(false);
            setStartX(e.pageX - containerRef.current.offsetLeft);
            setScrollLeftPosition(containerRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = (productName) => {
        setIsDragging(false);
        if (!dragged && typeof productName === 'string') {
            const formattedName = productName.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dashes and convert to lowercase
            router.push(`/${formattedName}`);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setDragged(true);
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        containerRef.current.scrollLeft = scrollLeftPosition - walk;
    };

    const scrollToLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 100; // Adjust the scroll value as needed
        }
    };

    const scrollToRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 100; // Adjust the scroll value as needed
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[100px]">
                <BounceLoader color="#505DB1" size={60} /> {/* Adjust the size as needed */}
            </div>
        );
    }

    return (
        <div className="relative font-sans_b max-w-[1440px] w-[100%] mx-auto mt-2">
            <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-navblue dark:bg-navblueD p-2 rounded-full shadow-md focus:outline-none mx-2 w-10 h-10 transition-transform duration-300 ease-in-out"
                onClick={scrollToLeft}
            >
                ◀
            </button>
            <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-navblue dark:bg-navblueD p-2 rounded-full shadow-md mx-2 w-10 h-10 focus:outline-none transition-transform duration-300 ease-in-out"
                onClick={scrollToRight}
            >
                ▶
            </button>
            <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={() => handleMouseUp(products.name)}
                onMouseMove={handleMouseMove}
                className="flex select-none overflow-x-auto w-[100%] no-scrollbar overflow-hidden transition-all duration-300 ease-in-out"
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex select-none flex-col justify-center items-center mx-3 cursor-pointer"
                        onMouseUp={() => handleMouseUp(product.name)}
                    >
                        <div
                            className="rounded-full w-[100px] h-[100px] mb-1 bg-cover bg-center"
                            style={{ backgroundImage: `url(https://midzi.liara.run${product.thumbnail})` }}
                        ></div>
                        <div className="text-text_b text-sm">{product.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
