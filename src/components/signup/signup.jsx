"use client"
import React, {useState} from 'react';
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
const Signup = () => {
    const [isVerify, setIsVerify] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("رمز عبور و تکرار رمز عبور مطابقت ندارند.");
            return;
        }

        const formData = new FormData();
        formData.append("phone_number", phoneNumber);
        formData.append("password", password);

        try {
            const {status} = await axios.post(
                "https://midzi.liara.run/accounts/signup/",
                formData
            );
            if (status === 200) {
                toast.success("کد تایید ارسال شد.");
                setIsVerify(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "خطا در ورودی ها یا اینترنت");
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const formDataVerify = new FormData();
        formDataVerify.append("phone_number", phoneNumber);
        formDataVerify.append("otp", otp);

        try {
            const res = await axios.post(
                "https://midzi.liara.run/accounts/signup/verify/",
                formDataVerify
            );
            if (res.status === 201) {
                toast.success("ورود با موفقیت انجام شد.");
                localStorage.setItem("token", res?.data?.token);
                router.push('/user');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "کد وارد شده نامعتبر است.");
        }
        setOtp(""); // Reset OTP value
        setIsVerify(false);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordsMatch(value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setPasswordsMatch(password === value);
    };
    return (
        <div className="flex font-sans_b justify-center items-center my-2">
            <div
                className="bg-navblue dark:bg-navblueD dark:text-text_w w-full mx-5 max-w-[600px] rounded-2xl flex flex-col items-center">
                <div className="flex justify-center text-xl items-center my-4  rounded-xl h-12 w-[30%]">
                    <Link href="/login"
                          className="cursor-pointer justify-center py-1 rounded-xl text-text_w mx-3 w-16 flex items-center bg-myblue">
                        ورود
                    </Link>
                    <Link href="/signup"
                          className="cursor-pointer py-1 justify-center rounded-xl text-text_w mx-3 w-16 flex items-center bg-mypurple">
                        عضویت
                    </Link>
                </div>
                <div
                    className="flex flex-col items-center bg-white dark:bg-bgdark dark:text-text_w w-[90%] mb-6 p-4 rounded-2xl shadow-xl">
                    {isVerify ? (
                        <form onSubmit={handleVerify}>
                            <input
                                name="code"
                                type="number"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="کد اس ام اس شده را وارد کنید "
                                className="appearance-none dark:bg-navblueD dark:text-text_w text-center my-2 shadow-lg p-2 rounded-lg w-full"
                            />
                            <button type="submit"
                                    className="cursor-pointer bg-myblue w-28 h-10 mx-auto mt-4 rounded-xl flex items-center justify-center text-text_w">
                                ورود
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="tel"
                                name="phone_number"
                                pattern="09[0-9]{9}|989[0-9]{9}"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="appearance-none dark:bg-navblueD dark:text-text_w rounded-2xl h-12 bg-navblue my-3 mx-auto shadow-sm w-full p-2"
                                placeholder="شماره موبایل"
                            />
                            <p className={"text-orange-600 font-sans"}> رمز عبور 8 حرفی شامل حداقل یک حرف انگلیسی</p>
                            <div className="relative w-full flex items-center">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`rounded-2xl dark:bg-navblueD dark:text-text_w h-12 my-3 mx-auto shadow-sm w-full p-2 ${passwordsMatch ? 'border-green-500' : 'border-red-500'}`}
                                    placeholder="رمز عبور"
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="mx-2 bg-navblue text-black dark:bg-navblueD dark:text-text_w rounded-xl p-2 font-awsome"
                                >
                                    {passwordVisible ? "" : ""}
                                </button>
                            </div>
                            <div className="relative w-full flex items-center">
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    name="confirm_password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={`rounded-2xl dark:bg-navblueD dark:text-text_w h-12 my-3 mx-auto shadow-sm w-full p-2 ${passwordsMatch ? 'border-green-500' : 'border-red-500'}`}
                                    placeholder="تکرار رمز عبور"
                                />
                                <button
                                    type="button"
                                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    className="mx-2 bg-navblue text-black dark:bg-navblueD dark:text-text_w rounded-xl p-2 font-awsome"
                                >
                                    {confirmPasswordVisible ? "" : ""}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="cursor-pointer bg-navblueD w-28 h-10 mx-auto mt-4 rounded-xl flex items-center justify-center text-text_w"
                                disabled={!passwordsMatch}
                            >
                                ورود
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;


