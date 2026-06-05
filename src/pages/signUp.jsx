import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSignupMutation, useSocialSignupMutation } from "../API/authApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";
const backGround = "/assets/images/BackGround.jpeg";
const google = "/assets/social-icon/google.png";
const facebook = "/assets/social-icon/facebook.png";

const GOOGLE_CLIENT_ID = "194974533693-9h7t8f3h8dj013jok7gpli5a6m1f6i99.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "8e14f60e2ff3ddcb7267acd797ac9feb";

const loadGoogleScript = () =>
    new Promise((resolve) => {
        if (document.getElementById("google-gsi-script")) { resolve(); return; }
        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.body.appendChild(script);
    });

const loadFacebookScript = () =>
    new Promise((resolve) => {
        if (document.getElementById("facebook-jssdk")) { resolve(); return; }
        window.fbAsyncInit = () => {
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: "v19.0",
            });
            resolve();
        };
        const script = document.createElement("script");
        script.id = "facebook-jssdk";
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    });

const SignUp = () => {
    const navigate = useNavigate();
    const [signupUser, { isLoading }] = useSignupMutation();
    const [socialSignup, { isLoading: isSocialLoading }] = useSocialSignupMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadGoogleScript();
        loadFacebookScript();
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

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
                state: { email: formData.email, type: "signup" },
            });
        } catch (error) {
            console.error(error);
            alert(error?.data?.message || "Signup Failed");
        }
    };

    const handleSocialAuth = async (socialSite, accessToken) => {
        try {
            await socialSignup({ socialSite, accessToken }).unwrap();
            alert(`${socialSite} Signup Successful`);
            navigate("/dashboard/home");
        } catch (error) {
            console.error(error);
            alert(error?.data?.message || `${socialSite} Signup Failed`);
        }
    };

    const handleGoogleSignup = () => {
        if (!window.google) { alert("Google SDK not loaded yet. Please try again."); return; }
        window.google.accounts.oauth2
            .initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: "openid email profile",
                callback: (tokenResponse) => {
                    if (tokenResponse?.access_token) {
                        handleSocialAuth("Google", tokenResponse.access_token);
                    } else {
                        alert("Google Signup Failed: no access token received.");
                    }
                },
            })
            .requestAccessToken();
    };

    const handleFacebookSignup = () => {
        if (!window.FB) { alert("Facebook SDK not loaded yet. Please try again."); return; }
        window.FB.login(
            (response) => {
                if (response.authResponse?.accessToken) {
                    handleSocialAuth("Facebook", response.authResponse.accessToken);
                } else {
                    alert("Facebook Signup cancelled or failed.");
                }
            },
            { scope: "public_profile,email" }
        );
    };

    const anyLoading = isLoading || isSocialLoading;

    return (
        <div className="relative min-h-screen w-full">
            <div
                className="absolute inset-0 bg-cover"
                style={{ backgroundImage: `url(${backGround})` }}
            />
            <div className="absolute inset-0 bg-[#0B4D1E]/30" />

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
                                type="text" name="firstName" placeholder="First Name"
                                value={formData.firstName} required onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />
                            <input
                                type="text" name="lastName" placeholder="Last Name"
                                value={formData.lastName} required onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />
                        </div>

                        <input
                            type="email" name="email" placeholder="Enter Email"
                            value={formData.email} required onChange={handleChange}
                            className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password" placeholder="Enter Password"
                                value={formData.password} required onChange={handleChange}
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
                                name="confirmPassword" placeholder="Confirm Password"
                                value={formData.confirmPassword} required onChange={handleChange}
                                className="w-full shadow-md rounded-xl px-4 py-3 outline-none border border-gray-200 focus:ring-2 focus:ring-green-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute top-4 right-4 text-gray-500">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit" disabled={anyLoading}
                            className="w-full bg-[#0B4D1E] hover:bg-[#083514] text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-60"
                        >
                            {isLoading ? "Loading..." : "Signup"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-gray-300" />
                        <span className="mx-3 text-gray-500 text-sm">OR</span>
                        <div className="flex-1 border-t border-gray-300" />
                    </div>

                    <div className="flex justify-center gap-4">
                        {/* Google */}
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={anyLoading}
                            title="Continue with Google"
                            className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300 disabled:opacity-60">
                            <img src={google} alt="google" className="w-6 h-6 object-contain" />
                        </button>

                        {/* Facebook */}
                        <button
                            type="button"
                            onClick={handleFacebookSignup}
                            disabled={anyLoading}
                            title="Continue with Facebook"
                            className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300 disabled:opacity-60">
                            <img src={facebook} alt="facebook" className="w-6 h-6 object-contain" />
                        </button>
                    </div>

                    {isSocialLoading && (
                        <p className="text-center text-sm text-gray-500 mt-3">
                            Connecting via social account...
                        </p>
                    )}

                    <p className="text-center mt-6 text-gray-600">
                        Already have account?
                        <Link to="/login" className="text-orange-500 ml-1 font-semibold">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;