import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useOtpVerificationMutation, useResendOtpMutation } from "../API/authApi";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";
const backGround = "/assets/images/BackGround.jpeg";
const otpImage = "/assets/images/Two factor authentication-bro 1.png";

const OTPVerification = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;
    const type = location.state?.type;

    const [otpVerification] = useOtpVerificationMutation();
    const [resendOtp] = useResendOtpMutation();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleResend = async () => {
        try {
            setLoading(true);

            await resendOtp({
                email: email
            }).unwrap();

            setOtp(["", "", "", ""]);
            setTimeLeft(60);
            setCanResend(false);

            alert("OTP resent successfully");

        } catch (error) {
            console.log(error);
            alert(error?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOtp = otp.join("");

        if (finalOtp.length !== 4) {
            alert("Please enter complete OTP");
            return;
        }

        if (!email) {
            alert("Email missing. Please go back and try again.");
            return;
        }

        try {
            setLoading(true);

            await otpVerification({
                email: email,
                otp: finalOtp
            }).unwrap();

            if (type === "signup") {
                navigate("/login");
            } else {
                navigate("/resetPassword", {
                    state: { email }
                });
            }

        } catch (error) {
            console.log(error);
            alert(error?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full">

            <div
                className="absolute inset-0 bg-cover"
                style={{ backgroundImage: `url(${backGround})` }}
            />

            <div className="absolute inset-0 bg-[#0B4D1E]/30"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-start px-4 py-6 sm:px-6">
                <div className="bg-white px-4 py-6 sm:p-8 lg:p-10 w-full max-w-2xl rounded-3xl shadow-2xl">

                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="logo" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4">
                        OTP Verification
                    </h2>

                    <p className="text-center text-gray-500">
                        OTP sent to {email || "your email"}
                    </p>

                    <div className="flex justify-center mt-3">
                        <img src={otpImage} alt="otp" className="w-40 object-contain" />
                    </div>

                    <form onSubmit={handleSubmit} className="mt-3 flex flex-col flex-1">

                        <div className="flex justify-center gap-5">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-14 h-14 bg-white border border-gray-200 rounded-xl text-center text-xl shadow-sm outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            ))}
                        </div>

                        <p className="text-center text-gray-500 text-sm mt-4 mb-4">

                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-orange-500 font-semibold"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Resend OTP"}
                                </button>
                            ) : (
                                <>
                                    Didn't receive OTP? Resend in{" "}
                                    <span className="font-bold">{timeLeft}s</span>
                                </>
                            )}

                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-auto w-full bg-[#D9D9D9] hover:bg-orange-500 hover:text-white text-gray-700 py-4 rounded-xl font-semibold transition duration-300"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default OTPVerification;