"use client"
import React from 'react';
import Link from "next/link";
import Menu from "@/components/Menu";
import Image from "next/image";
import Search from "@/components/search";

import NaviCons from "@/components/navicons";
import BotNav from "@/components/bot_nav";


const Navbar = () => {
    const [isDark, setIsDark] = React.useState(false);

    return (
        <div className='flex flex-col justify-center items-center'>
            <div id="navbar"
                 className='h-16 px-4 justify-between  md:px-8 w-full lg:px-16  flex flex-row items-center relative bg-navblue xl:max-w-[1440px] mx-auto mt-6  rounded-3xl '>
                <div className="flex flex-row items-center justify-between">

                    <Menu/>
                    <Image src="/logo.png" alt='' height={75} width={150} className="hidden lg:flex" />
                </div>
                <div id="search_and_dark" className="flex flex-row justify-between ">
                    <div id="dark"
                         className="rounded-full w-10 h-10 font-awsome bg-myblue  justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 hidden lg:flex"
                         onClick={() => setIsDark((prev) => !prev)}>{isDark ? '' : ''}
                    </div>
                    <Search/>
                </div>

                <div className="flex flex-row items-center justify-between">
                    <NaviCons/>
                </div>
            </div>
            <BotNav/>
        </div>

    );
};

export default Navbar;