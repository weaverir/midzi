"use client";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer1 from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import SliderCircle from "@/components/slider_circle";
import { AuthProvider } from '@/lib/loginauth';
import CartProvider from '@/lib/cartAuth';
import {usePathname, useRouter} from "next/navigation";
import { createContext, useContext } from 'react';

// Create a context to manage the current path
const PathContext = createContext();

function Layout({ children, currentPath }) {
    const { darkMode } = useDarkMode();
    const path = usePathname();


    return (
        <html lang="en" dir="rtl" className={darkMode ? 'dark' : ''}>
        <body className={`bg-stone-50 dark:bg-bgdark dark:text-text_w text-black flex flex-col mx-auto`}>
        <Toaster />
        <Navbar />
        {path.startsWith('/admin' ) || path.startsWith('/user') || path.startsWith('/login') || path.startsWith('/signup') ?  null  :<SliderCircle /> }

        {children}
        <Footer1 />
        </body>
        </html>
    );
}

export default function RootLayout({ children }) {
    const router = useRouter();
    const currentPath = router.pathname;

    return (
        <DarkModeProvider>
            <AuthProvider>
                <CartProvider>
                    <PathContext.Provider value={currentPath}>
                        <Layout currentPath={currentPath}>{children}</Layout>
                    </PathContext.Provider>
                </CartProvider>
            </AuthProvider>
        </DarkModeProvider>
    );
}

// Custom hook to use the PathContext
export const usePath = () => useContext(PathContext);
