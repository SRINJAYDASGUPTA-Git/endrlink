'use client';

import Image from 'next/image';
import Link from 'next/link';
import {SparklesCore} from './ui/sparkles';
import {useUser} from "@/providers/UserContext";
import {UserButton} from "@/components/UserButton"; // Adjust import if needed

export default function Navbar() {
    const {user, loading} = useUser();
    if (loading) {
        return null;
    }
    return (
        <>
            {/* Full-width wrapper with sticky navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                {/* 🟣 Glow behind navbar */}
                <div
                    className="absolute top-0 left-0 w-full bg-purple-500 blur-[160px] opacity-30 pointer-events-none"
                    style={{animation: 'var(--animate-pulse-glow)'}}
                />

                {/* 🔳 Navbar content */}
                <nav
                    className="relative px-6 py-4 flex justify-between items-center bg-gray-800/80 backdrop-blur-md border-b border-purple-500/20 shadow-lg"
                    style={{
                        boxShadow: '0 0 50px 30px rgba(168, 85, 247, 0.3)',
                    }}
                >
                    {/* Logo */}
                    <Link href="/">
                        <Image src="/logo.svg" alt="Logo" width={100} height={100}/>
                    </Link>

                    {/* Buttons */}
                    {
                        user && user.name !== 'Temporary User' ? (
                            <UserButton/>
                        ) : (
                            <div className="space-x-4">

                                <Link
                                    href="/login"
                                    className="px-4 py-2 border border-purple-400 text-purple-300 rounded-xl hover:bg-purple-600 hover:text-white transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                                >
                                    Signup
                                </Link>
                            </div>
                        )
                    }

                </nav>

                {/* ✨ Sparkles under navbar */}
                <div className="relative w-full h-32 -mt-1 z-10">
                    <SparklesCore
                        background={"transparent"}
                        minSize={0.4}
                        maxSize={2}
                        particleDensity={500}
                        className="w-full h-[60%]"
                        particleColor="#FFFFFF"
                    />
                    {/*<div*/}
                    {/*    className="absolute inset-0 bg-gray-800/60 [mask-image:radial-gradient(400px_200px_at_top,transparent_30%,white)]"/>*/}
                </div>
            </div>


        </>
    );
}
