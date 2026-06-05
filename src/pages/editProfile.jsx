import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery, useUpdateProfileMutation, useUploadImageMutation } from "../API/authApi";

const Editimg = "/assets/sidebar-icon/edit-img.png";

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const token = useSelector((state) => state.auth.token);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", dob: "", phone: "",
        aboutMe: "", address: "", countryCode: "", gender: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const { data } = useGetProfileQuery(undefined, {
        refetchOnMountOrArgChange: true,
        skip: !token,
    });

    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const user = data?.data;

    const [imagePreview, setImagePreview] = useState(
        localStorage.getItem("profileImageBase64") || null
    );

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                dob: user?.dob || "",
                phone: user?.phone || "",
                aboutMe: user?.aboutMe || "",
                address: user?.address || "",
                countryCode: user?.countryCode || "",
                gender: user?.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
                    : "",
            });

            if (!localStorage.getItem("profileImageBase64") && user?.profileImage) {
                const authToken = token || localStorage.getItem("token");
                if (authToken) {
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
                                setImagePreview(reader.result);
                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch(() => setImagePreview(null));
                }
            }
        }
    }, [user, token]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            localStorage.setItem("profileImageBase64", reader.result);
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let profileImageUrl = localStorage.getItem("profileImage") || "";

            if (imageFile) {
                const uploadRes = await uploadImage(imageFile).unwrap();

                const imgKey = uploadRes?.data?.[0] || "";
                const imgUrl = imgKey
                    ? `https://dev.api.crowdcareaid.com/api/getImage?key=${imgKey}`
                    : "";

                console.log("uploadRes:", uploadRes);
                console.log("imgKey:", imgKey);
                console.log("imgUrl:", imgUrl);

                profileImageUrl = imgUrl;
                localStorage.setItem("profileImage", imgUrl);
            }

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                phone: formData.phone,
                aboutMe: formData.aboutMe,
                address: formData.address,
                countryCode: formData.countryCode,
                gender: formData.gender?.toLowerCase(),
                profileImage: profileImageUrl,
            };

            await updateProfile(payload).unwrap();

            // Dono components ko notify karo ke image update ho gayi
            window.dispatchEvent(new CustomEvent("profileImageUpdated"));

            alert("Profile Updated Successfully");
            navigate("/users/getAuthUserDetails");
        } catch (error) {
            console.log("Update Error:", error);
            alert(error?.data?.message || "Update Failed");
        }
    };

    return (
        <div className="bg-white min-h-screen px-4 sm:px-10 lg:px-35 py-10 max-sm:py-6">
            <div className="bg-white rounded-2xl max-w-5xl mx-auto">

                <div className="flex items-center gap-5 max-sm:gap-3 mb-10 max-sm:mb-6">
                    <div className="relative w-24 h-24 max-sm:w-16 max-sm:h-16">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="profile"
                                className="w-24 h-24 max-sm:w-16 max-sm:h-16 rounded-full object-cover"
                                onError={() => {
                                    setImagePreview(null);
                                }}
                            />
                        ) : null}
                        <div
                            className="w-24 h-24 max-sm:w-16 max-sm:h-16 rounded-full bg-[#F0F4F7] border-2 border-[#D1D5DB] items-center justify-center"
                            style={{ display: imagePreview ? "none" : "flex" }}
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

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 max-sm:w-5 max-sm:h-5 bg-[#193D1D] border-2 border-white rounded-full cursor-pointer"
                        >
                            <img src={Editimg} alt="Change Image" className="w-3 h-3 max-sm:w-2 max-sm:h-2 object-contain" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div>
                        <h2 className="text-[28px] max-sm:text-[20px] font-bold text-[#1D3B1F]">
                            {formData.firstName || "Jane"} {formData.lastName || "Cooper"}
                        </h2>
                        <p className="text-gray-500 text-sm max-sm:text-[12px]">{user?.email || "janecooper@gmail.com"}</p>
                        <p className="text-gray-400 text-sm max-sm:text-[12px] mt-1">
                            {formData.address || "New York"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-sm:gap-4">
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">First Name</label>
                            <input
                                type="text" name="firstName" value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            />
                        </div>
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">Last Name</label>
                            <input
                                type="text" name="lastName" value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            />
                        </div>
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">Date of Birth</label>
                            <input
                                type="text" name="dob" value={formData.dob}
                                onChange={handleChange}
                                placeholder="DD-MM-YYYY"
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            />
                        </div>
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">Phone</label>
                            <input
                                type="text" name="phone" value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 max-sm:mt-4">
                        <label className="text-sm max-sm:text-[12px] text-gray-600">About Me</label>
                        <textarea
                            rows="5" name="aboutMe" value={formData.aboutMe}
                            onChange={handleChange}
                            className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none resize-none text-sm max-sm:text-[12px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-sm:gap-4 mt-6 max-sm:mt-4">
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">Address</label>
                            <input
                                type="text" name="address" value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            />
                        </div>
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">Country Code</label>
                            <input
                                type="text" name="countryCode" value={formData.countryCode}
                                onChange={handleChange}
                                placeholder="+1"
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            />
                        </div>
                        <div>
                            <label className="text-sm max-sm:text-[12px] text-gray-600">Gender</label>
                            <select
                                name="gender" value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-[#F0F4F7] rounded-lg px-4 py-3 max-sm:py-2.5 mt-2 outline-none text-sm max-sm:text-[12px]"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-8 max-sm:gap-3 mt-10 max-sm:mt-7">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full border border-[#1D3B1F] text-[#1D3B1F] py-3 max-sm:py-2.5 rounded-xl text-sm max-sm:text-[13px] font-semibold hover:bg-[#F3F4F6] transition"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="w-full bg-[#1D3B1F] text-white py-3 max-sm:py-2.5 rounded-xl text-sm max-sm:text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isUploading ? "Uploading..." : isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};
export default EditProfile;