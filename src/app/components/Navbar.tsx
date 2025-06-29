"use client";
import React from 'react'
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Navbar() {
    return (
        <nav className="bg-white shadow-md py-3 px-4 md:px-12 flex items-center justify-between">
            {/* โลโก้หรือชื่อเว็บ */}
            <Link href="/" className="text-xl font-bold text-blue-700">
                MyApp
            </Link>

            {/* ลิงก์เมนู */}
            <div className="flex items-center space-x-4">
                <Link href="/" className="hover:text-blue-500 transition font-medium">
                    Log in
                </Link>
                <Link href="/register" className="hover:text-blue-500 transition font-medium">
                    Register
                </Link>

                {/* Social icons */}
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={22} className="text-blue-600 hover:scale-125 transition" />
                </Link>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={22} className="text-pink-500 hover:scale-125 transition" />
                </Link>
                <Link href="https://x.com" target="_blank" rel="noopener noreferrer">
                    <FaXTwitter size={22} className="text-black hover:scale-125 transition" />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar