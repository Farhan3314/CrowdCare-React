import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useLoginMutation, useSocialSignupMutation } from "../API/authApi";
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


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUser, { isLoading }] = useLoginMutation();
    const [socialSignup, { isLoading: isSocialLoading }] = useSocialSignupMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    useEffect(() => {
        loadGoogleScript();
        loadFacebookScript();
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser({
                email: formData.email,
                password: formData.password,
                loginType: "email",
            }).unwrap();
            alert("Login Successful");
            navigate("/dashboard/home");
        } catch (error) {
            console.error(error);
            alert(error?.data?.message || "Login Failed");
        }
    };

    const handleSocialAuth = async (socialSite, accessToken) => {
        try {
            await socialSignup({ socialSite, accessToken }).unwrap();
            alert(`${socialSite} Login Successful`);
            navigate("/dashboard/home");
        } catch (error) {
            console.error(error);
            alert(error?.data?.message || `${socialSite} Login Failed`);
        }
    };

    const handleGoogleLogin = () => {
        if (!window.google) { alert("Google SDK not loaded yet. Please try again."); return; }
        window.google.accounts.oauth2
            .initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: "openid email profile",
                callback: (tokenResponse) => {
                    if (tokenResponse?.access_token) {
                        handleSocialAuth("Google", tokenResponse.access_token);
                    } else {
                        alert("Google Login Failed: no access token received.");
                    }
                },
            })
            .requestAccessToken();
    };

    const handleFacebookLogin = () => {
        if (!window.FB) { alert("Facebook SDK not loaded yet. Please try again."); return; }
        window.FB.login(
            (response) => {
                if (response.authResponse?.accessToken) {
                    handleSocialAuth("Facebook", response.authResponse.accessToken);
                } else {
                    alert("Facebook Login cancelled or failed.");
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
                        Welcome Back
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-4">
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

                        <div className="flex justify-end">
                            <Link to="/forgotPassword" className="text-sm text-orange-500 font-medium hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit" disabled={anyLoading}
                            className="w-full bg-[#0B4D1E] hover:bg-[#083514] text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-60"
                        >
                            {isLoading ? "Loading..." : "Login"}
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
                            onClick={handleGoogleLogin}
                            disabled={anyLoading}
                            title="Continue with Google"
                            className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition duration-300 disabled:opacity-60">
                            <img src={google} alt="google" className="w-6 h-6 object-contain" />
                        </button>

                        {/* Facebook */}
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
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
                        Don't have an account?
                        <Link to="/signUp" className="text-orange-500 ml-1 font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;