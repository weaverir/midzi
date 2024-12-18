"use client";
import React from 'react';
import Menu from "@/components/Menu";
import Search from "@/components/search";
import { useDarkMode } from "@/context/DarkModeContext";
import NaviCons from "@/components/navicons";
import BotNav from "@/components/bot_nav";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const router = useRouter();

    return (
        <div className='flex flex-col justify-center items-center'>
            <div
                id="navbar"
                className={`mt-2 h-16 px-4 justify-between w-[100%] md:px-8 lg:px-16 flex max-w-[1440px] flex-row items-center top-0 z-50 bg-navblue dark:bg-navblueD dark:text-white rounded-3xl dark:border-gray-700 fixed md:relative md:top-0 md:rounded-3xl md:mt-2 bottom-navbar`}>
                <div className="flex flex-row items-center justify-between">
                    <Menu />
                    <div
                        className="hidden lg:flex cursor-pointer"
                        onClick={() => router.push(`/`)}
                        style={{
                            backgroundImage: darkMode ? "url('/logod.png')" : "url('/logo.png')",
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            height: '75px',
                            width: '150px'
                        }}
                    />
                </div>
                <div id="search_and_dark" className="flex flex-row justify-between">
                    <div
                        id="dark"
                        className="rounded-full w-10 h-10 font-awsome bg-myblue justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 hidden lg:flex"
                        onClick={toggleDarkMode}>
                        {darkMode ? '' : ''}
                    </div>
                    <Search />
                </div>
                <div className="flex flex-row items-center justify-between">
                    <NaviCons />
                </div>
            </div>
            <div className="h-20 md:h-0"></div> {/* Adjusted Spacer for mobile and tablet sizes */}
            <BotNav />
        </div>
    );
};

export default Navbar;
