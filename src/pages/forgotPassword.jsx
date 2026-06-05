import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useForgotPasswordMutation } from "../API/authApi";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";
const backGround = "/assets/images/BackGround.jpeg";

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {

            const response = await forgotPassword({
                email: email,
            }).unwrap();

            console.log(response);
            alert("Verification code sent to your email");
            navigate("/verifyOtp", {
                state: {
                    email,
                    type: "reset",
                },
            });

        } catch (error) {
            console.log(error);
            alert(
                error?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="relative min-h-screen w-full">

            <div
                className="absolute inset-0 bg-cover"
                style={{ backgroundImage: `url(${backGround})` }}>
            </div>

            <div className="absolute inset-0 bg-[#0B4D1E]/30"></div>
            <div className="relative z-10 min-h-screen flex items-center sm:items-start justify-start px-4 py-6 sm:px-6">
                <div className="bg-white px-4 py-6 sm:p-8 lg:p-10 w-full max-w-2xl sm:min-h-screen rounded-3xl shadow-2xl">

                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="logo" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
                        Reset Password
                    </h2>

                    <p className="text-center text-gray-500 mb-6">
                        Please enter your email address that you used to register with us.
                    </p>

                    <form onSubmit={handleForgotPassword} className="space-y-4">

                        <input
                            type="email" placeholder="Enter Email" value={email} required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                        />

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition duration-300">
                            {isLoading ? "Sending..." : "Send Email"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;