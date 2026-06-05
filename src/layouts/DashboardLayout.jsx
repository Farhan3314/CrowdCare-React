import React, { useState, useEffect } from "react";
import { useGetProfileQuery } from "../API/authApi";
import { useGetUserNotificationsQuery } from "../API/notificationApi";
import { useSelector } from "react-redux";

import { Menu, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

import Logout from "../pages/logout";
import DeleteAccount from "../pages/deleteAccount";
import { useNavigate } from "react-router-dom";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";

const homeIcon = "/assets/sidebar-icon/home1.png";
const homeIconActive = "/assets/sidebar-icon/home.png";

const squarePlusIcon = "/assets/sidebar-icon/squarePlus1.png";
const squarePlusIconActive = "/assets/sidebar-icon/squarePlus.png";

const donateIcon = "/assets/sidebar-icon/donate1.png";
const donateIconActive = "/assets/sidebar-icon/donate.png";

const myCampaigns = "/assets/sidebar-icon/myCampaigns1.png";
const myCampaignsActive = "/assets/sidebar-icon/myCampaigns.png";

const settingIcon = "/assets/sidebar-icon/setting1.png";
const settingIconActive = "/assets/sidebar-icon/setting.png";

const bellIcon = "/assets/sidebar-icon/bell.png";
const Down = "/assets/sidebar-icon/down.png";

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname.startsWith(path);
    const [showSettings, setShowSettings] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const { data, refetch } = useGetProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const user = data?.data;
    const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

    const [navImageUrl, setNavImageUrl] = useState(
        localStorage.getItem("profileImageBase64") || null
    );

    const { data: notificationsData } = useGetUserNotificationsQuery(undefined, {
        pollingInterval: 60000,
        refetchOnMountOrArgChange: true,
    });
    const notifications = notificationsData?.data || [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        const handleUpdate = () => {
            const base64 = localStorage.getItem("profileImageBase64");
            if (base64) setNavImageUrl(base64);
        };
        window.addEventListener("profileImageUpdated", handleUpdate);
        return () => window.removeEventListener("profileImageUpdated", handleUpdate);
    }, []);

    useEffect(() => {
        if (localStorage.getItem("profileImageBase64")) return;
        if (!user?.profileImage) return;
        const authToken = token || localStorage.getItem("token");
        if (!authToken) return;

        fetch(user.profileImage, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("failed");
                return res.blob();
            })
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    localStorage.setItem("profileImageBase64", reader.result);
                    setNavImageUrl(reader.result);
                };
                reader.readAsDataURL(blob);
            })
            .catch(() => setNavImageUrl(null));
    }, [user?.profileImage, token]);

    return (

        <div className="flex relative overflow-hidden">
            <div
                className={`
                    fixed lg:static
                    top-0 left-0
                    w-60
                    min-h-screen
                    bg-linear-to-b
                    from-[#1A3F1E]
                    to-[#44A54F]
                    text-white
                    p-5
                    flex flex-col
                    z-50
                    transition-transform
                    duration-300
                    ${mobileMenu ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}>

                <div className="flex justify-end lg:hidden mb-2">
                    <button onClick={() => setMobileMenu(false)}>
                        <X size={24} />
                    </button>
                </div>
                <Link
                    to="/dashboard/home"
                    onClick={() => setMobileMenu(false)}
                    className="bg-white rounded-lg py-3 px-4 flex items-center justify-center mt-4 mb-8"
                >
                    <div className="flex justify-center">
                        <img src={logo} alt="logo" />
                    </div>
                </Link>

                <div className="space-y-2">
                    <Link
                        to="/dashboard/home"
                        onClick={() => setMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition ${isActive("/dashboard/home")
                            ? "bg-white text-[#1A3F1E]"
                            : "hover:bg-white/10"
                            }`}
                    >
                        <img
                            src={isActive("/dashboard/home")
                                ? homeIconActive
                                : homeIcon
                            }
                            alt="Home"
                            className="w-5 h-5 min-w-5 object-contain"
                        />

                        <span className="text-[14px]">Home</span>
                    </Link>

                    <Link
                        to="/Campaign/CreateCampaign"
                        onClick={() => setMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition ${isActive("/Campaign/CreateCampaign")
                            ? "bg-white text-[#1A3F1E]"
                            : "hover:bg-white/10"
                            }`}
                    >
                        <img
                            src={isActive("/Campaign/CreateCampaign")
                                ? squarePlusIconActive
                                : squarePlusIcon
                            }
                            alt="Create Campaign"
                            className="w-5 h-5 min-w-5 object-contain"
                        />

                        <span className="text-[14px]">Create Campaign</span>
                    </Link>

                    <Link
                        to="/Donation/DonationHistory"
                        onClick={() => setMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition ${isActive("/Donation/DonationHistory")
                            ? "bg-white text-[#1A3F1E]"
                            : "hover:bg-white/10"
                            }`}
                    >
                        <img
                            src={isActive("/Donation/DonationHistory")
                                ? donateIconActive
                                : donateIcon
                            }
                            alt="Create Donation"
                            className="w-5 h-5 min-w-5 object-contain"
                        />

                        <span className="text-[14px]">Donation History</span>
                    </Link>

                    <Link
                        to="/myCampaigns"
                        onClick={() => setMobileMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition ${isActive("/myCampaigns")
                            ? "bg-white text-[#1A3F1E]"
                            : "hover:bg-white/10"
                            }`}
                    >
                        <img
                            src={isActive("/myCampaigns")
                                ? myCampaignsActive
                                : myCampaigns
                            }
                            alt="My Campaigns"
                            className="w-5 h-5 min-w-5 object-contain"
                        />

                        <span className="text-[14px]">My Campaigns</span>
                    </Link>

                    <div
                        onClick={() => setShowSettings(!showSettings)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full cursor-pointer transition ${showSettings
                            ? "bg-white text-[#1A3F1E]"
                            : "hover:bg-white/10"
                            }`}
                    >
                        <img
                            src={showSettings
                                ? settingIconActive
                                : settingIcon
                            }
                            alt="Setting"
                            className="w-5 h-5 min-w-5 object-contain"
                        />

                        <span className="text-[14px]">Setting</span>
                    </div>

                    {showSettings && (
                        <div className="ml-10 mt-2 flex flex-col gap-2">

                            <Link
                                to="/users/getAuthUserDetails"
                                onClick={() => setMobileMenu(false)}
                                className={`text-sm rounded-lg px-2 py-2 transition ${isActive("/users/getAuthUserDetails")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                My Profile
                            </Link>

                            <Link
                                className="text-[#B6B6B6] hover:text-white text-sm rounded-lg px-2 py-2 transition"
                            >
                                Language
                            </Link>

                            <Link
                                to="/dashboard/setting/FAQ"
                                onClick={() => setMobileMenu(false)}
                                className={`text-sm rounded-lg px-2 py-2 transition ${isActive("/dashboard/setting/FAQ")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                FAQ
                            </Link>

                            <Link
                                to="/changePassword"
                                onClick={() => setMobileMenu(false)}
                                className={`text-sm rounded-lg px-2 py-2 transition ${isActive("/changePassword")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                Change Password
                            </Link>

                            <Link
                                to="/dashboard/setting/PrivacyPolicy"
                                onClick={() => setMobileMenu(false)}
                                className={`text-sm rounded-lg px-2 py-2 transition ${isActive("/dashboard/setting/PrivacyPolicy")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/dashboard/setting/Terms_&_Condition"
                                onClick={() => setMobileMenu(false)}
                                className={`text-sm rounded-lg px-2 py-2 transition ${isActive("/dashboard/setting/Terms_&_Condition")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                Terms & Condition
                            </Link>
                            <Link
                                to="/logout"
                                onClick={() => { setShowLogout(true); setMobileMenu(false); }}
                                className={`text-sm rounded-lg px-2 py-2 transition ${isActive("/logout")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                Log out
                            </Link>
                            <Link
                                to="/deleteAccount"
                                onClick={() => { setShowDeleteAccount(true); setMobileMenu(false); }}
                                className={`text-sm rounded-lg px-2 py-2 transition text-left text-red-500 hover:text-white ${isActive("/deleteAccount")
                                    ? "text-white"
                                    : "text-[#B6B6B6] hover:text-white"
                                    }`}
                            >
                                Delete Account
                            </Link>

                        </div>
                    )}

                </div>
            </div>

            {mobileMenu && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenu(false)}
                />
            )}
            <div className="flex-1 w-full lg:ml-0">
                <div className="bg-white shadow-md px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden"
                            onClick={() => setMobileMenu(true)}
                        >
                            <Menu size={28} />
                        </button>

                        <h2 className="hidden md:block text-[18px] font-semibold text-black">
                            Crowd Care
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => navigate("/users/getAuthUserDetails")}
                            className="flex items-center justify-center gap-2 border border-[#858585] px-1.5 py-1 rounded-sm bg-white cursor-pointer hover:shadow-sm transition">

                            {navImageUrl ? (
                                <img
                                    src={navImageUrl}
                                    alt="profile"
                                    className="w-8 h-8 rounded-sm object-cover"
                                    onError={() => setNavImageUrl(null)}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-sm bg-[#F0F4F7] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                    </svg>
                                </div>
                            )}
                            <span className="text-sm font-semibold text-gray-800">
                                {user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
                            </span>

                            <div className="flex items-center">
                                <img src={Down} alt="Down" className="w-6 h-6 ml-4" />
                            </div>
                        </div>

                        <button className="hidden sm:flex items-center justify-center border border-[#858585] px-2 py-2 rounded-sm bg-white hover:bg-gray-100 transition cursor-pointer relative">
                            <img src={bellIcon} alt="bell" className="w-6 h-6 object-contain" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <main>
                    <Outlet />
                </main>

                <Logout
                    isOpen={showLogout}
                    onClose={() => setShowLogout(false)}
                    userName={user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
                />
                <DeleteAccount
                    isOpen={showDeleteAccount}
                    onClose={() => setShowDeleteAccount(false)}
                    userName={user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
                />

            </div>
        </div>
    );
};

export default DashboardLayout;