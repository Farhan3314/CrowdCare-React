import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useSignupMutation } from "../API/authApi";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";
const backGround = "/assets/images/BackGround.jpeg";
const google = "/assets/social-icon/google.png";
const facebook = "/assets/social-icon/facebook.png";

const SignUp = () => {
    const navigate = useNavigate();
    const [signupUser, { isLoading }] = useSignupMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await signupUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            }).unwrap();

            console.log(response);
            alert("Signup Successful");
            navigate("/verifyOtp", {
                state: {
                    email: formData.email,
                    type: "signup",
                },
            });
        } catch (error) {
            console.log(error);
            alert(error?.data?.message || "Signup Failed");
        }
    };

    return (
        <div className="relative min-h-screen w-full">
            <div
                className="absolute inset-0 bg-cover"
                style={{ backgroundImage: `url(${backGround})` }}>
            </div>

            <div className="absolute inset-0 bg-[#0B4D1E]/30"></div>
            <div className="relative z-10 min-h-screen flex items-center justify-start px-4 py-6 sm:px-8">
                <div className="bg-white py-6 px-4 sm:p-8 lg:p-10 w-full max-w-2xl rounded-3xl shadow-2xl">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="logo" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
                        Create your Account
                    </h2>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text" name="firstName" placeholder="First Name" value={formData.firstName} required
                                onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />

                            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} required
                                onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />
                        </div>

                        <input
                            type="email" name="email" placeholder="Enter Email" value={formData.email} required
                            onChange={handleChange}
                            className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password" placeholder="Enter Password" value={formData.password} required
                                onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-4 right-4 text-gray-500">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} required
                                onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-4 right-4 text-gray-500"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0B4D1E] hover:bg-[#083514] text-white py-3 rounded-xl font-semibold transition duration-300"
                        >
                            {isLoading ? "Loading..." : "Signup"}
                        </button>

                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="mx-3 text-gray-500 text-sm">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button type="button"
                            className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300">
                            <img src={google} alt="google"
                                className="w-6 h-6 object-contain" />
                        </button>

                        <button type="button"
                            className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300">
                            <img src={facebook} alt="facebook"
                                className="w-6 h-6 object-contain" />
                        </button>
                    </div>

                    <p className="text-center mt-6 text-gray-600">
                        Already have account?
                        <Link
                            to="/login"
                            className="text-orange-500 ml-1 font-semibold"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;