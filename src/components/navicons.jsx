"use client";
import React, { useEffect, useState, useContext, useRef } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartModal from "@/components/cartmodal";
import { CartContext  } from '@/lib/cartAuth';
import { AuthContext } from '@/lib/loginauth';

const NaviCons = () => {
    const { cartItemCount, fetchCartItemCount } = useContext(CartContext);
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const router = useRouter();
    const profileRef = useRef(null);
    const cartRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartItemCount();
        }

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        const handleRouteChange = () => {
            setIsProfileOpen(false);
            setIsCartOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        router.events?.on('routeChangeStart', handleRouteChange);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            router.events?.off('routeChangeStart', handleRouteChange);
        };
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    const handleProfile1 =()=>{
        router.push('/user')
        setIsProfileOpen(false);
    }

    const handleProfile = () => {
        if (!isAuthenticated) {
            router.push('./login');
        } else {
            setIsProfileOpen((prev) => !prev);
        }
    };

    return (
        <div id="cart_user" className="flex flex-row items-center justify-between mx-1 relative">
            <div
                id="cart"
                ref={cartRef}
                className="flex rounded-full w-8 h-8 font-awsome bg-myblue justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 text-sm"
                onClick={() => setIsCartOpen(!isCartOpen)}
            >
                🛒
                {cartItemCount > 0 && (
                    <div className='absolute bottom-[2px] flex -right-[2px] w-4 h-4 bg-red-700 rounded-full items-center justify-center text-sm'>
                        {cartItemCount}
                    </div>
                )}
                {isCartOpen && <CartModal />}
            </div>

            <div
                id='login'
                ref={profileRef}
                className="rounded-full w-10 h-10 font-awsome bg-mypurple flex justify-center items-center text-text_w shadow-lg mx-1"
            >
                <div className="font-awsome cursor-pointer" onClick={handleProfile}></div>
                {isProfileOpen && (
                    <div
                        className="absolute dark:bg-navblueD dark:text-text_w font-sans_b p-4 top-12 z-50 left-0 bg-navblue rounded-xl text-text_b">
                        <p>{name}</p>
                        <div className="mt-2 cursor-pointer" onClick={handleProfile1}>پروفایل</div>
                        <div className="mt-2 cursor-pointer" onClick={handleLogout}>خروج</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NaviCons;
