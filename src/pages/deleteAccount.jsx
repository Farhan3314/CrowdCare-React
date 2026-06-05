import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteAccountMutation } from "../API/authApi";

const DeleteAccount = ({ isOpen, onClose, userName }) => {
    const navigate = useNavigate();
    const [deleteAccount] = useDeleteAccountMutation();

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            localStorage.clear();
            sessionStorage.clear();
            navigate("/signUp");
        } catch (error) {
            console.error("Delete Account Error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999 px-4 max-sm:px-4">
            <div className="w-105 max-sm:w-full max-sm:max-w-sm rounded-md overflow-hidden bg-white shadow-xl">

                <div className="bg-[#1A3F1E] text-white text-center py-4 max-sm:py-3">
                    <h2 className="text-[25px] max-sm:text-[18px] font-medium">
                        Delete Account
                    </h2>
                </div>

                <div className="py-10 max-sm:py-7 text-center px-4">
                    <h3 className="font-semibold text-[16px] max-sm:text-[14px]">
                        {userName}
                    </h3>
                    <p className="text-black mt-3 max-sm:mt-2 text-[14px] max-sm:text-[12px]">
                        Are you sure you want delete this account?
                    </p>
                </div>

                <div className="grid grid-cols-2">
                    <button
                        onClick={onClose}
                        className="bg-orange-500 text-white py-3 max-sm:py-2.5 font-medium text-[16px] max-sm:text-[14px] hover:opacity-90 transition"
                    >
                        No
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-[#1A3F1E] text-white py-3 max-sm:py-2.5 font-medium text-[16px] max-sm:text-[14px] hover:opacity-90 transition"
                    >
                        Yes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteAccount;