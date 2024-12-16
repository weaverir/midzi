"use client"
import React from 'react';
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useState} from "react";
import react from "react";
import {router} from "next/client";


const signUp = () => {
    const [isVerify, setIsVerify] = react.useState(false);
    const [phone_number, setPhoneNumber] = react.useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("phone_number", e.target.phone_number.value);
        formData.append("password", e.target.password.value);

        // Simulate API request
        try {
            const { data, status } = await axios.post(
                "https://midzi.liara.run/accounts/signup/",
                formData
            );
            console.log(status);
            if (status === 200) {
                toast.success("کد تایید ارسال شد.");
                setIsVerify(true);
            }
        } catch (error) {
            toast.error("خطا در ورودی‌ها");
        }
        console.log("form submitted");
    };
    const handleVerify = async (e) => {
        e.preventDefault();
        const formDataVerify = new FormData();
        formDataVerify.append("phone_number", phone_number);
        formDataVerify.append("otp", e.target.code.value);


        try {
            const res = await axios.post(
                "https://midzi.liara.run/accounts/signup/verify/",
                formDataVerify
            );
            if (res.status === 201) {
                toast.success("ورود با موفقیت انجام شد.");
                // Redirect to dashboard
                localStorage.setItem(res?.data?.token);
                // window.location.href = '/dashboard'
                router.push('/user');
            }
        } catch (error) {
            toast.error("کد وارد شده نامعتبر است.", error.message);
        }
        setIsVerify(false);
    };
    return (
        <div className="flex font-sans_b justify-center content-center my-2 items-center">

            <div className="bg-navblue w-full mx-5 max-w-[600px] rounded-2xl flex justify-center content-center items-center flex-col">
                <div id="login_bulllshits" className="flex flex-row justify-center text-xl content-center items-center my-4 bg-white rounded-xl h-12 w-[30%]">
                    <Link  href="/login" className={`cursor-pointer rounded-xl justify-center text-text_w mx-3 w-16 content-center items-center flex bg-myblue`}
                    >ورود
                    </Link>
                    <Link  href="/signup" className={`cursor-pointer rounded-xl justify-center text-text_w mx-3 w-16 content-center items-center flex bg-mypurple`}
                           >عضویت
                    </Link>
                </div>

                <div className="flex flex-col justify-center content-center rounded-2xl shadow-xl items-center bg-white w-[90%] mb-6">
                    {isVerify ? (
                        <form onSubmit={handleVerify}>
                            <input
                                defaultValue={0}
                                name="code"
                                type="number"
                                minLength={5}
                                maxLength={5}
                                placeholder="کد"
                                className="text-center my-2 shadow-lg"/>
                            <button type="submit"
                                    className='cursor-pointer bg-myblue w-28 mb-5 h-10 mx-auto content-center rounded-xl justify-center flex text-text_w'>ورود
                            </button>


                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input type='number'
                                   name={"phone_number"}
                                   pattern="09[0-9]{9}|989[0-9]{9}"
                                   onChange={(e) => setPhoneNumber(e.target.value)}
                                   className=' appearance-none rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex'
                               placeholder='شماره موبایل'
                        />
                        <input type='password'
                               name={"password"}
                               className=' rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm justify-center flex'
                               placeholder='رمز عبور'
                        />
                        <button type="submit"
                                className='cursor-pointer bg-myblue w-28 mb-5 h-10 mx-auto content-center rounded-xl justify-center flex text-text_w'>ورود
                        </button>
                    </form>)}
                </div>


            </div>
        </div>
            );
};

export default signUp;