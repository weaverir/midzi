import React from 'react';

const BotNav = () => {
    return (
        <div
            className=" flex-row items-center justify-between max-w-[1200] bg-navblue h-12 w-[80%]  border-t rounded-br-2xl rounded-bl-2xl hidden xl:flex">
            <li className="flex flex-row items-center justify-between gap-3 mx-3">
                <ul>دسته بندی</ul>
                <ul>دسته بندی</ul>
                <ul>دسته بندی</ul>
                <ul>دسته بندی</ul>
            </li>
        </div>
    );
};

export default BotNav;