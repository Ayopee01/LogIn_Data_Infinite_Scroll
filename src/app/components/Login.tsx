"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Inter } from "next/font/google";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
});

type Inputs = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const router = useRouter();

    const onSubmit = (data: Inputs) => {
        alert(`log in successful for ${data.email}`);
        router.push("/home");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-md flex flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full px-8 py-10 space-y-6 bg-white rounded-xl shadow"
                >
                    <h2 className="text-3xl font-bold text-gray-700 text-center mb-2">Login to your Account</h2>
                    <p className="text-gray-500 text-center mb-4">See what is going on with your business</p>

                    {/* Google Login */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-gray-700 font-semibold hover:bg-gray-100 transition"
                    >
                        <FcGoogle size={28} />
                        Continue with Google
                    </button>

                    <div className="flex items-center my-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="mx-2 text-gray-400 text-sm">or Sign in with Email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="mail@abc.com"
                            {...register("email", {
                                required: "Please enter your email.",
                                pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Invalid email format." }
                            })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        {errors.email && (
                            <div className="text-xs text-red-500 mt-1">{errors.email.message}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="********"
                            {...register("password", {
                                required: "Please enter your password.",
                                minLength: { value: 6, message: "Password must be more than 6 characters." },
                                pattern: {
                                    value: /[a-zA-Z]/,
                                    message: "Password must contain at least one letter."
                                }
                            })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        {errors.password && (
                            <div className="text-xs text-red-500 mt-1">{errors.password.message}</div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-[#7f265b]" />
                            Remember Me
                        </label>
                        <a href="#" className="text-[#7f265b] hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                    {/* Login */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#7f265b] text-white font-semibold rounded-lg hover:bg-purple-900 transition"
                    >
                        Login
                    </button>
                </form>
                {/* Create an account */}
                <div className="text-center text-gray-500 text-sm mt-4">
                    Not Registered Yet?{" "}
                    <Link href="/register" className="text-[#7f265b] font-semibold hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
