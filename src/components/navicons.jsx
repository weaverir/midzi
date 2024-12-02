import React from 'react';
import Link from "next/link";
import {useRouter} from "next/navigation";
import CartModal from "@/components/cartmodal";

const NaviCons = () => {
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const router = useRouter();
    const isLoggedIn = true ;
    const [isDark, setIsDark] = React.useState(false);
    const HandleProfile = () => {
        if(!isLoggedIn){
            router.push('./login')
        }
        setIsProfileOpen((prev) => !prev) ;


    }
    return (
        <div id="cart_user" className="flex flex-row items-center justify-between mx-1 relative">

            <div id="cart"
                 className=" flex rounded-full w-8 h-8 font-awsome bg-myblue  justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 text-sm md:flex lg:flex xl:flex 2xl:flex"
                 onClick={() => setIsCartOpen(!isCartOpen)}>
                <div
                    className='absolute bottom-[2px] flex -right-[2px] w-4 h-4 bg-red-700 rounded-full items-center justify-center text-sm '>1</div>
                {isCartOpen && (<CartModal/>)}
            </div>


            <div id='login'
                 className="rounded-full w-10 h-10  font-awsome bg-mypurple flex justify-center items-center text-text_w shadow-lg mx-1">
                <div className="font-awsome" onClick={HandleProfile}>
                </div>
                {isProfileOpen ? <div className="absolute p-4 top-12 z-50 left-0 bg-navblue rounded-xl text-text_b ">
                    <Link href='/'>پروفایل</Link>
                    <div className="mt-2 cursor-pointer">
                        خارج شدن
                    </div>
                </div> : ``}
            </div>
        </div>

    );
};

export default NaviCons;