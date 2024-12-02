"use client"
import React from 'react';

const List = () => {
    const [open1, setOpen1] = React.useState(true);
    const [open2, setOpen2] = React.useState(false);
    //solved by goat.amir
    function Switch( open1 ) {
            setOpen2(false) ;
        setOpen1((open1)=> !open1)
    }
    function Switch2( open2 ) {
        setOpen1(false) ;
        setOpen2((open2)=> !open2)
    }
    return (
        <div className="flex justify-center content-center items-center">
            <div className="bg-navblue  w-full mx-5 max-w-[600px] rounded-2xl flex justify-center content-center items-center flex-col">
                <div id="login_bulllshits" className="flex flex-row justify-center text-xl content-center items-center my-4 bg-white rounded-xl h-12 w-[30%]">
                    <div className={` cursor-pointer rounded-xl justify-center text-text_w mx-3 w-16 content-center items-center flex ${open1 ? `bg-mygblue` : `bg-mypurple`} `}
                         onClick={() => Switch(open1)}>ورود
                    </div>
                    <div className={` cursor-pointer rounded-xl justify-center text-text_w  mx-3 w-16 content-center items-center flex ${open2 ? `bg-mygblue` : `bg-mypurple`} `}
                         onClick={() => Switch2(open2)}>عضویت
                    </div>

                </div>
                {open1 ? <div className="flex flex-col justify-center content-center rounded-2xl shadow-xl items-center bg-white w-[90%] mb-6">
                    <input type='text' className='w-3/4 rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex' placeholder='شماره موبایل'/>
                    <input type='password' className='w-3/4 rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex' placeholder='رمز عبور'/>
                    <a href={'/user'}  className='cursor-pointer bg-myblue w-28 mb-5  h-10 content-center  rounded-xl justify-center flex text-text_w'>ورود</a>

                </div> : ``}
                {open2 ? <div
                    className="flex flex-col justify-center content-center rounded-2xl shadow-xl items-center bg-white w-[90%] mb-6">
                    <input type='text'
                           className='w-3/4 rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex'
                           placeholder='نام و نام خانوادگی'/>
                    <input type='password'
                           className='w-3/4 rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex'
                           placeholder='رمز عبور  '/>
                    <input type='password'
                           className='w-3/4 rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex'
                           placeholder='تکرار رمز عبور '/>
                    <input type='text'
                           className='w-3/4 rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex'
                           placeholder='شماره موبایل'/>
                    <a href={'/user'}
                       className='cursor-pointer bg-myblue w-28 mb-5  h-10 content-center  rounded-xl justify-center flex text-text_w'>ثبت نام </a>

                </div> : ``}

            </div>
        </div>
    );
};

export default List;