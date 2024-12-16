import React, { useEffect, useState, useContext } from 'react';
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

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartItemCount();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        router.push('./login');
    };

    const HandleProfile = () => {
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
                className="flex rounded-full w-8 h-8 font-awsome bg-myblue justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 text-sm"
                onClick={() => setIsCartOpen(!isCartOpen)}
            >
                🛒
                {cartItemCount > 0 && (
                    <div className='absolute bottom-[2px] flex -right-[2px] w-4 h-4 bg-red-700 rounded-full items-center justify-center text-sm'>
                        {cartItemCount}
                    </div>
                )}

            </div>

            {isCartOpen && <CartModal />}
            <div
                id='login'
                className="rounded-full w-10 h-10 font-awsome bg-mypurple flex justify-center items-center text-text_w shadow-lg mx-1"
            >
                <div className="font-awsome" onClick={HandleProfile}></div>
                {isProfileOpen && (
                    <div className="absolute dark:bg-navblueD dark:text-text_w font-sans_b p-4 top-12 z-50 left-0 bg-navblue rounded-xl text-text_b">
                        <p>{name}</p>
                        <Link href='/user'>پروفایل</Link>
                        <div className="mt-2 cursor-pointer " onClick={handleLogout}>خارج شدن</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NaviCons;
