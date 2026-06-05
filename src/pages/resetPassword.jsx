import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useResetPasswordMutation } from "../API/authApi";
import { useNavigate, useLocation } from "react-router-dom";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";
const backGround = "/assets/images/BackGround.jpeg";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showPopup, setShowPopup] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!email) {
            alert("Email missing. Please restart forgot password process.");
            navigate("/forgotPassword");
            return;
        }

        try {
            await resetPassword({
                email: email,
                newPassword: formData.password,
            }).unwrap();

            setShowPopup(true);

        } catch (error) {
            console.log(error);

            alert(
                error?.data?.message ||
                error?.message ||
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
            <div className="relative z-10 min-h-screen flex items-center justify-start px-4 py-6 sm:px-6">
                <div className="bg-white px-4 py-6 sm:p-8 lg:p-10 w-full max-w-2xl rounded-3xl shadow-2xl">

                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="logo" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
                        Reset Password
                    </h2>

                    <p className="text-center text-[#9c9c9c] text-[18px] leading-5 mb-10">
                        To change your account password,
                        <br />
                        please fill in the fields below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password" placeholder="New Password" value={formData.password} required
                                onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9c9c9c]">

                                {showPassword ? (
                                    <FaEyeSlash size={16} />
                                ) : (
                                    <FaEye size={16} />
                                )}
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
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9c9c9c]">

                                {showConfirmPassword ? (
                                    <FaEyeSlash size={16} />
                                ) : (
                                    <FaEye size={16} />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full h-14 bg-[#E67E22] hover:bg-[#cf6d16] text-white rounded-[10px] font-semibold text-[15px] mt-12 transition-all duration-300">
                            {isLoading ? "Loading..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-[90vw] sm:w-180 rounded-xl overflow-hidden shadow-2xl">
                        <div className="flex justify-center pt-6 pb-4">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="bg-[#0B4D1F] text-white text-center py-3 text-lg font-medium">
                            Password Change
                        </div>
                        <div className="py-10 text-center text-gray-700">
                            Password Changed Successfully
                        </div>
                        <div className="flex justify-center pb-6">
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-[#0B4D1F] hover:bg-green-800 text-white px-20 py-4 rounded-md text-lg">
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;