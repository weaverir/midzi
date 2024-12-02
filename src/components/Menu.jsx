import React from 'react';
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const Menu = () => {
    const [open, setOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const router =useRouter() ;
    const HandleSearch1 = (e) => {
        e.preventDefault();
        const formData1 = new FormData(e.currentTarget);
        const name = formData1.get("name");
        if(name) {
            router.push(`/list?name=${name}`)
        }
    }
    return (
        <>
            <div className="font-awsome cursor-pointer  lg:hidden text-xl  sm:hidden"
                 onClick={() => setOpen((prev) => !prev)}>
                {open ? `` : ``}
                <div>
                    {open && (
                        <div
                            className=" absolute z-50 left-0 top-16 h-[calc(100vh-100px)] bg-navblue w-full mt-4  flex flex-col items-center justify-center gap-8">
                            <Link href='/'>خانه</Link>
                            <Link href='/'>محصولات</Link>
                            <Link href='/login'>ورود</Link>
                        </div>
                    )}
                </div>
            </div>
            <div id="dark"
                 className="rounded-full w-10 h-10 font-awsome bg-myblue  justify-center items-center text-text_w shadow-lg cursor-pointer mx-1 flex lg:hidden"
                 onClick={() => setIsDark((prev) => !prev)}>{isDark ? '' : ''}
            </div>

            <div className="font-awsome cursor-pointer  lg:hidden text-xl  sm:hidden bg-myblue rounded-full w-[40px] h-[40px] flex items-center justify-center text-text_w" onClick={()=>setSearchIsOpen(!searchIsOpen)}>
                
                {searchIsOpen ?  (
                    <div
                        className=" absolute z-50 left-0 top-16 h-[calc(100vh-100px)] bg-navblue w-full mt-4 text-text_b flex flex-col items-center justify-start gap-8">
                        <div className=" flex-row gap-8  mt-4 flex  z-50 ">
                            <form onSubmit={HandleSearch1} className=' flex flex-row rounded  '>
                                <input type="text" name="name" placeholder='دنبال چی میگردی ؟'
                                       className='flex flex-1 shadow rounded-2xl bg-white mx-4 placeholder:flex placeholder:justify-center placeholder:items-center'/>
                                <button type="submit"
                                    className='font-awsome bg-myblue text-text_w rounded-full w-[40px] h-[40px] '>
                                </button>
                            </form>
                        </div>
                    </div>
                ): ``}
            </div>
        </>
    );
};

export default Menu;