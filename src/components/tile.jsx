"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const images = [
    '/1a.png',
    '/2a.png',
    '/3a.png',
    '/4a.png',
    '/5a.png',
    '/6a.png'
];

const Tile = () => {
    const router = useRouter();

    const handleClick = (index) => {
        const links = [
            '/search?category=19',
            '/search?category=24',
            '/search?category=10',
            '/search?category=15',
            '/search?category=23',
            '/search?category=14'
        ];
        router.push(links[index]);
    };

    return (
        <div className="grid grid-cols-3 gap-3 my-2 mx-2">
            {images.map((src, index) => (
                <div
                    key={index}
                    className="relative w-full cursor-pointer"
                    style={{ paddingBottom: '151.6%' }} // Aspect ratio of 644:977 (height/width * 100)
                    onClick={() => handleClick(index)}
                >
                    <Image src={src} alt={`Image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-2xl" />
                </div>
            ))}
        </div>
    );
};

export default Tile;
