import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../API/authApi";

const Logout = ({ isOpen, onClose, userName }) => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout().unwrap();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            localStorage.removeItem("campaignDraft");  // draft clear karo

            sessionStorage.clear();  // session to clear ho sakta hai

            setIsLoading(false);
            navigate("/login");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
            <div className="w-105 rounded-md overflow-hidden bg-white shadow-xl">

                <div className="bg-[#1A3F1E] text-white text-center py-4">
                    <h2 className="text-[25px] font-medium">
                        Sign out
                    </h2>
                </div>

                <div className="py-10 text-center">
                    <h3 className="font-semibold text-[16px]">
                        {userName}
                    </h3>
                    <p className="text-black mt-3 text-[14px]">
                        Are you sure you want to sign out this account?
                    </p>
                </div>

                <div className="grid grid-cols-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="bg-orange-500 text-white text-[16px] py-3 font-medium disabled:opacity-60"
                    >
                        No
                    </button>

                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="bg-[#1A3F1E] text-white text-[16px] py-3 font-medium disabled:opacity-60"
                    >
                        {isLoading ? "Signing out..." : "Yes"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Logout;