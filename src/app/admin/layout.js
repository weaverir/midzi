"use client";
import React from 'react';
import { UserProvider } from '@/lib/UserContext';
import Admin_rightnavbar from "@/components/admin/admin_rightnavbar"; // Import UserProvider

const adminLayout = ({ children }) => {
    return (
        <UserProvider>
            <div className="my-2  max-w-[1440px] w-[100%] justify-self-center mx-auto text-black font-sans_b gap-3 flex flex-col lg:flex-row py-8 px-3">
                <Admin_rightnavbar /> {/* Render the RightSidebar component */}
                {children}
            </div>
        </UserProvider>
    );
};

export default adminLayout;
