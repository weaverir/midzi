"use client"
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

const UserBilling = () => {
    const router = useRouter();

    const [id, setId] = useState(null);
    const [refId, setRefId] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const refId = params.get('refid');
        const status = params.get('status') === 'True';

        setId(id);
        setRefId(refId);
        setStatus(status);
    }, []);
    return (
        <div
            className={`flex flex-col justify-start p-4 gap-5 items-center rounded-2xl w-full ${status ? 'bg-green-400' : 'bg-red-400'}`}>
            <div
                className={`font-awsome bg-navblue dark:bg-bgdark rounded-full w-32 h-32 flex justify-center items-center text-6xl ${status ? 'text-green-500' : 'text-red-500'}`}>
                {status ? '✓' : ''}
            </div>
            <div
                className={"rounded-2xl w-[90%] p-4 gap-3 bg-navblue dark:bg-bgdark flex flex-col justify-center items-center"}>
                <p className={`text-2xl font-sans_b ${status ? 'text-green-500' : 'text-red-500'}`}>
                    {status ? 'پرداخت موفقیت آمیز' : 'پرداخت ناموفق'}
                </p>
                <p className={"text-black font-sans dark:text-text_w"}> شماره سفارش : {id} </p>
                <p className={"text-black font-sans dark:text-text_w"}> {refId ? `شماره مرجع : ${refId}` : ''} </p>
                <p className={"font-sans cursor-pointer select-none text-text_w rounded-2xl p-4 bg-mygblue "}
                   onClick={() => router.push('/user/orders')}>بازگشت به سفارشات</p>
            </div>
        </div>
    );
};

export default UserBilling;





