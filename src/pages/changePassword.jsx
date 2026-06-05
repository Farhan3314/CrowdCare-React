import React, { useState } from "react";
import { useChangePasswordMutation } from "../API/authApi";

const ChangePassword = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const res = await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            }).unwrap();
            alert("Password changed successfully");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            console.log(res);
        } catch (error) {
            console.error(error);
            alert(error?.data?.message || "Password change failed");
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-white px-35 max-sm:px-4 py-10 max-sm:py-6">
            <div className="max-w-5xl mx-auto">

                <h2
                    className="text-[30px] max-sm:text-[22px] font-bold text-[#1F4B2C] mb-5 max-sm:mb-4"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    Change Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="w-full h-15 max-sm:h-12 px-10 max-sm:px-5 mb-5 max-sm:mb-3 rounded-lg border shadow-md text-sm max-sm:text-[13px]"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full h-15 max-sm:h-12 px-10 max-sm:px-5 mb-5 max-sm:mb-3 rounded-lg border shadow-md text-sm max-sm:text-[13px]"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full h-15 max-sm:h-12 px-10 max-sm:px-5 mb-25 max-sm:mb-10 rounded-lg border shadow-md text-sm max-sm:text-[13px]"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-18 max-sm:h-12 bg-[#1A3F1E] text-white text-[20px] max-sm:text-[15px] rounded-lg"
                    >
                        {isLoading ? "Processing..." : "Continue"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ChangePassword;