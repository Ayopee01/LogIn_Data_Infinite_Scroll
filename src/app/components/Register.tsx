"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
//import google font Inter
import { Inter } from "next/font/google";
//import useRouter
import { useRouter } from "next/navigation";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
});

type Inputs = {
    email: string;
    password: string;
    // เพิ่ม field อื่นๆ ตามต้องการ
};

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const router = useRouter();

    const onSubmit = (data: Inputs) => {
        alert(`register successful for ${data.email}`);
        router.push("/");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${inter.className} max-w-sm mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg space-y-6`}
        >
            <h2 className="text-2xl font-bold text-center text-green-700">Register</h2>
            <div>
                <label className="block text-gray-700 mb-1" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email", {
                        required: "Please enter your email.",
                        pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Invalid email format." }
                    })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
            </div>
            <div>
                <label className="block text-gray-700 mb-1" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password", {
                        required: "Please enter your password",
                        minLength: { value: 6, message: "Password must be more than 6 characters." },
                        pattern: {
                            value: /[a-zA-Z]/,
                            message: "Password must contain at least one letter"
                        }
                    })}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password.message}</div>}
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                Register
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <Link href="/" className="text-blue-500 hover:underline font-medium">
                    Sign in
                </Link>
            </p>
        </form>
    );
}
