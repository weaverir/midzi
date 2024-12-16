"use client";
import React from 'react';
import RightSidebar from "@/components/user/rightsidecomponent";
import { UserProvider } from '@/lib/UserContext'; // Import UserProvider

const UserLayout = ({ children }) => {
    return (
        <UserProvider>
            <div className="my-2 max-w-[1440px] w-[100%] justify-self-center mx-auto text-black font-sans_b gap-3 flex flex-col lg:flex-row py-8 px-3">
                <RightSidebar /> {/* Render the RightSidebar component */}
                {children}
            </div>
        </UserProvider>
    );
};

export default UserLayout;
