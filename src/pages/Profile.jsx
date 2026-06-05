import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../API/authApi";

const Edit = "/assets/sidebar-icon/edit-text.png";

const Profile = () => {
    const navigate = useNavigate();
    const { data, refetch } = useGetProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const user = data?.data;
    const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

    const [imageUrl, setImageUrl] = useState(
        localStorage.getItem("profileImageBase64") || null
    );

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        const handleUpdate = () => {
            const base64 = localStorage.getItem("profileImageBase64");
            if (base64) setImageUrl(base64);
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
                    setImageUrl(reader.result);
                };
                reader.readAsDataURL(blob);
            })
            .catch(() => setImageUrl(null));
    }, [user?.profileImage, token]);

    return (
        <div className="bg-white min-h-screen px-4 sm:px-8 md:px-16 lg:px-28 xl:px-35 py-6 sm:py-10">
            <div className="bg-white rounded-2xl max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="relative w-24 h-24 max-sm:w-16 max-sm:h-16 shrink-0">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="profile"
                                    className="w-24 h-24 max-sm:w-16 max-sm:h-16 rounded-full object-cover"
                                />
                            ) : null}

                            <div
                                className="w-24 h-24 max-sm:w-16 max-sm:h-16 rounded-full bg-[#F0F4F7] border-2 border-[#D1D5DB] items-center justify-center"
                                style={{ display: imageUrl ? "none" : "flex" }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-10 h-10 max-sm:w-7 max-sm:h-7 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-[22px] sm:text-[28px] font-bold text-[#1D3B1F] leading-tight">
                                {user?.firstName || ""} {user?.lastName || ""}
                            </h2>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {user?.email || ""}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                {user?.address || ""}
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/users/updateAuthUserDetails")}
                        className="flex items-center gap-2 bg-[#F0F4F7] hover:bg-[#E5E7EB] px-5 py-2 rounded-lg text-[14px] font-medium transition w-fit"
                    >
                        <span>Edit</span>
                        <img
                            src={Edit}
                            alt="Edit Text"
                            className="w-4 h-4 object-contain"
                        />
                    </button>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mt-8 sm:mt-10">
                    <div>
                        <label className="text-sm text-gray-600">First Name</label>
                        <div className="bg-[#F0F4F7] rounded-lg px-4 py-3 mt-2 text-sm">
                            {user?.firstName || "Jane"}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Last Name</label>
                        <div className="bg-[#F0F4F7] rounded-lg px-4 py-3 mt-2 text-sm">
                            {user?.lastName || "Cooper"}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Date of Birth</label>
                        <div className="bg-[#F0F4F7] rounded-lg px-4 py-3 mt-2 text-sm">
                            {user?.dob || "-"}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <div className="bg-[#F0F4F7] rounded-lg px-4 py-3 mt-2 text-sm">
                            {user?.phone || "-"}
                        </div>
                    </div>

                </div>

                <div className="mt-5 sm:mt-6">
                    <label className="text-sm text-gray-600">About Me</label>
                    <div className="bg-[#F0F4F7] rounded-lg px-4 py-4 mt-2 text-sm text-gray-600 leading-7 text-justify wrap-break-word whitespace-pre-wrap">
                        {user?.aboutMe ||
                            "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mt-5 sm:mt-6">
                    <div>
                        <label className="text-sm text-gray-600">Location</label>
                        <div className="bg-[#F0F4F7] rounded-lg px-4 py-3 mt-2 text-sm">
                            {user?.address || "New York"}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Gender</label>
                        <div className="bg-[#F0F4F7] rounded-lg px-4 py-3 mt-2 text-sm">
                            {user?.gender || "-"}
                        </div>
                    </div>
                </div>

                <div className="mt-8 sm:mt-10">
                    <h2 className="text-[24px] sm:text-[30px] font-bold text-[#1D3B1F] mb-4 sm:mb-5">
                        Contribution
                    </h2>

                    <div className="grid grid-cols-3 overflow-hidden rounded-xl">
                        <div className="bg-[#EA7E24] text-white py-6 sm:py-10 text-center border-r border-white">
                            <h3 className="text-[20px] sm:text-[32px] font-bold">3</h3>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-lg">Campaigns</p>
                        </div>

                        <div className="bg-[#EA7E24] text-white py-6 sm:py-10 text-center border-r border-white">
                            <h3 className="text-[20px] sm:text-[32px] font-bold">$ 5,000</h3>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-lg">Donation</p>
                        </div>

                        <div className="bg-[#EA7E24] text-white py-6 sm:py-10 text-center">
                            <h3 className="text-[20px] sm:text-[32px] font-bold">$ 5,000</h3>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-lg">Generate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;