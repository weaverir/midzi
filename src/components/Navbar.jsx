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
        <div className="flex flex-col justify-center items-center">
            <div
                id="navbar"
                className={`h-16 px-4 justify-center w-[100%] md:justify-between md:px-8 lg:px-16 flex max-w-[1440px] flex-row items-center z-50 bg-navblue dark:bg-navblueD dark:text-white rounded-3xl dark:border-gray-700 fixed bottom-0 md:relative md:mt-2 md:rounded-3xl`}
            >
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
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? '' : ''}
                    </div>
                    <Search />
                </div>
                <div className="flex flex-row items-center justify-between">
                    <NaviCons />
                </div>
            </div>
            <BotNav />
            <div
                className="flex cursor-pointer lg:hidden"
                onClick={() => router.push(`/`)}
                style={{
                    backgroundImage: darkMode ? "url('/logod.png')" : "url('/logo.png')",
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '100px',
                    width: '150px'
                }}
            />
        </div>
    );
};

export default Navbar;
