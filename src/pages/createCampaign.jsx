import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Check, X } from "lucide-react";
import { useCreateCampaignMutation, useUpdateCampaignMutation } from "../API/campaignApi";
import { useGetCategoriesQuery } from "../API/categoryApi";

import "../index.css";
const campaignBanner = "/assets/images/donation-banner.jpeg";

const DRAFT_KEY = "campaignDraft";

const CreateCampaign = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector((state) => state.auth.token);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const editData = location.state?.editData;
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCategory, setShowCategory] = useState(false);

    const [formData, setFormData] = useState(() => {
        if (editData) {
            return {
                title: editData.title || "",
                category: editData.category?._id || editData.category || "",
                location: editData.location || "",
                city: editData.city || "",
                amount: editData.target || editData.amount || "",
                startDate: editData.startDate || "",
                endDate: editData.endDate || "",
                description: editData.description || "",
                images: editData.images || [],
            };
        }
        try {
            const saved = localStorage.getItem(DRAFT_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") return parsed;
            }
        } catch (err) {
            console.log("Draft parse error:", err);
        }
        return {
            title: "",
            category: "",
            location: "",
            city: "",
            amount: "",
            startDate: "",
            endDate: "",
            description: "",
            images: [],
        };
    });

    useEffect(() => {
        if (editData) return;
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        } catch (err) {
            console.log("Draft save error:", err);
        }
    }, [formData, editData]);

    const { data: categoriesData } = useGetCategoriesQuery(undefined, {
        skip: !token,
    });

    const [createCampaign] = useCreateCampaignMutation();
    const [updateCampaign] = useUpdateCampaignMutation();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const compressImage = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX = 400;
                    let { width, height } = img;
                    if (width > height && width > MAX) {
                        height = Math.round((height * MAX) / width);
                        width = MAX;
                    } else if (height > MAX) {
                        width = Math.round((width * MAX) / height);
                        height = MAX;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.4));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 10) {
            alert("Maximum 10 images allowed");
            return;
        }
        const base64Images = await Promise.all(
            files.map((file) => compressImage(file))
        );
        setSelectedFiles((prev) => [...prev, ...files]);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images],
        }));
    };

    const handleNextStep1 = () => {
        let newErrors = {};
        if (!(formData.title || "").trim()) newErrors.title = "Title is required";
        if (!formData.category.trim()) newErrors.category = "Category is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) setStep(2);
    };

    const handleNextStep2 = () => {
        let newErrors = {};
        if (!formData.amount) newErrors.amount = "Amount is required";
        if (!formData.startDate || !formData.endDate) newErrors.duration = "Date range is required";
        if (!formData.description) newErrors.description = "Description is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) setStep(3);
    };

    const handleCreate = async () => {
        try {
            const payload = {
                title: (formData.title || "").trim(),
                category: formData.category,
                location: formData.location,
                city: formData.city,
                amount: Number(formData.amount),
                description: formData.description,
                duration: [formData.startDate, formData.endDate],
                images: formData.images,
            };

            if (editData) {
                const response = await updateCampaign({
                    id: editData._id,
                    body: payload,
                }).unwrap();

                const updatedCampaign = response?.data;

                const existing = JSON.parse(localStorage.getItem("localCampaigns") || "[]");
                localStorage.setItem(
                    "localCampaigns",
                    JSON.stringify(
                        existing.map((c) =>
                            c._id === editData._id
                                ? {
                                    ...c,
                                    ...updatedCampaign,
                                    target: updatedCampaign?.target || Number(formData.amount),
                                    duration: `${formData.startDate} - ${formData.endDate}`,
                                    startDate: formData.startDate,
                                    endDate: formData.endDate,
                                    city: formData.city,
                                }
                                : c
                        )
                    )
                );

                alert("Campaign Updated Successfully");
                navigate("/myCampaigns", { state: { campaign: updatedCampaign || editData } });
                return;
            }

            const response = await createCampaign(payload).unwrap();
            const savedCampaign = response?.data;

            const existing = JSON.parse(localStorage.getItem("localCampaigns") || "[]");
            localStorage.setItem("localCampaigns", JSON.stringify([
                ...existing,
                {
                    ...savedCampaign,
                    target: savedCampaign.target || Number(formData.amount),
                    raised: savedCampaign.raised || 0,
                    duration: `${formData.startDate} - ${formData.endDate}`,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    city: formData.city,
                },
            ]));

            alert("Campaign Created Successfully");
            localStorage.removeItem(DRAFT_KEY);
            navigate("/myCampaigns", { state: { campaign: savedCampaign } });

        } catch (error) {
            console.log(error);

            if (editData) {
                const existing = JSON.parse(localStorage.getItem("localCampaigns") || "[]");
                const updatedLocal = existing.map((c) =>
                    c._id === editData._id
                        ? {
                            ...c,
                            title: (formData.title || "").trim(),
                            category: getCategoryName(),
                            location: formData.location,
                            city: formData.city,
                            target: Number(formData.amount),
                            duration: `${formData.startDate} - ${formData.endDate}`,
                            startDate: formData.startDate,
                            endDate: formData.endDate,
                            description: formData.description,
                            images: formData.images,
                        }
                        : c
                );
                localStorage.setItem("localCampaigns", JSON.stringify(updatedLocal));
                alert("Campaign Updated");
                navigate("/myCampaigns");
                return;
            }

            const localCampaign = {
                _id: "local_" + Date.now(),
                title: (formData.title || "").trim(),
                category: getCategoryName(),
                location: formData.location,
                city: formData.city,
                target: Number(formData.amount),
                raised: 0,
                duration: formData.startDate + " - " + formData.endDate,
                startDate: formData.startDate,
                endDate: formData.endDate,
                description: formData.description,
                images: formData.images,
            };

            const existing = JSON.parse(localStorage.getItem("localCampaigns") || "[]");
            localStorage.setItem("localCampaigns", JSON.stringify([...existing, localCampaign]));

            alert("Campaign Saved");
            localStorage.removeItem(DRAFT_KEY);
            navigate("/myCampaigns", { state: { campaign: localCampaign } });
        }
    };

    const getCategoryName = () => {
        return (
            categoriesData?.data?.find((c) => c._id === formData.category)?.name ||
            formData.category ||
            ""
        );
    };

    return (
        <div className="create-campaign bg-white min-h-screen">
            <div className="bg-[#EA7E24] py-4">
                <h1 className="text-center text-white text-[30px] font-semibold">
                    {step === 1 && "Fundraiser Details"}
                    {step === 2 && "Amount Details"}
                    {step === 3 && "Review"}
                </h1>
            </div>

            <div className="campaign-wrapper px-6 md:px-20 lg:px-35 py-10 flex gap-6">
                <div className="campaign-stepper">
                    <div className="mobile-stepper-line"></div>

                    <div className="step-item flex items-start gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white
                            ${step >= 1 ? "bg-[#1F4B2C]" : "bg-[#858585]"}`}>
                            {step > 1 ? <Check size={16} /> : 1}
                        </div>
                        <h3 className="pt-1 text-sm">Fundraiser Details</h3>
                    </div>

                    <div className="step-item flex items-start gap-4 mt-65 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white
                           ${step >= 2 ? "bg-[#1F4B2C]" : "bg-[#858585]"}`}>
                            {step > 2 ? <Check size={16} /> : 2}
                        </div>
                        <h3 className="pt-1 text-sm">Amount Details</h3>
                    </div>

                    <div className="step-item flex items-start gap-4 mt-65 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white
                            ${step >= 3 ? "bg-[#1F4B2C]" : "bg-[#858585]"}`}>
                            3
                        </div>
                        <h3 className="pt-1 text-sm">Review</h3>
                    </div>
                </div>

                <div className="flex-1 max-w-4xl overflow-y-auto pb-10">
                    {step === 1 && (
                        <>
                            <div
                                className="relative rounded-xl overflow-hidden h-60 mb-8"
                                style={{
                                    backgroundImage: `url(${campaignBanner})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-[#1A3F1E]/65"></div>
                                <div className="relative z-10 h-full flex flex-col justify-end p-5">
                                    <h2 className="text-[#EA7E24] text-[30px] pl-3 font-bold">Empower Change</h2>
                                    <p className="text-white text-[35px] pl-3 text-start font-semibold">
                                        Contribute to Our Cause Today
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Enter Title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`w-full h-14 shadow-sm bg-white border rounded-lg px-5 outline-none hover:shadow-md transition-all
                                            ${errors.title ? "border-red-500" : "border-[#E5E5E5]"}`}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Choose Category"
                                        value={getCategoryName()}
                                        readOnly
                                        onClick={() => { setShowCalendar(false); setShowCategory(true); }}
                                        className={`w-full h-14 shadow-sm bg-white border rounded-lg px-5 outline-none hover:shadow-md transition-all cursor-pointer
                                            ${errors.category ? "border-red-500" : "border-[#E5E5E5]"}`}
                                    />
                                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}

                                    {showCategory && (
                                        <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto">
                                            {categoriesData?.data?.map((cat) => (
                                                <div
                                                    key={cat._id}
                                                    onClick={() => {
                                                        setFormData({ ...formData, category: cat._id });
                                                        setErrors({ ...errors, category: "" });
                                                        setShowCategory(false);
                                                    }}
                                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {cat.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Enter Location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`w-full h-14 shadow-sm bg-white border rounded-lg px-5 outline-none hover:shadow-md transition-all
                                            ${errors.location ? "border-red-500" : "border-[#E5E5E5]"}`}
                                    />
                                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full h-14 shadow-sm bg-white border rounded-lg px-5 outline-none hover:shadow-md transition-all
                                            ${errors.city ? "border-red-500" : "border-[#E5E5E5]"}`}
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleNextStep1}
                                        className="w-44 h-14 bg-[#EA7E24] hover:bg-[#d66f1d] transition-all text-white rounded-xl"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="w-full max-w-3xl">
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            className={`w-full h-14 shadow-sm bg-white border rounded-lg px-5 outline-none hover:shadow-md transition-all
                                                ${errors.amount ? "border-red-500" : "border-[#E5E5E5]"}`}
                                        />
                                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            placeholder="Duration Date"
                                            value={
                                                formData.startDate && formData.endDate
                                                    ? `${formData.startDate} - ${formData.endDate}`
                                                    : ""
                                            }
                                            onClick={() => setShowCalendar(!showCalendar)}
                                            className={`w-full h-14 shadow-sm bg-white border rounded-lg px-5 outline-none hover:shadow-md transition-all cursor-pointer
                                                ${errors.duration ? "border-red-500" : "border-[#E5E5E5]"}`}
                                        />

                                        {showCalendar && (
                                            <div className="absolute top-16 left-0 z-50 bg-white border rounded-xl shadow-lg p-2.5 flex gap-4">
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => {
                                                        setFormData((prev) => ({ ...prev, startDate: e.target.value }));
                                                        setErrors((prev) => ({ ...prev, duration: "" }));
                                                    }}
                                                />
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => {
                                                        setFormData((prev) => {
                                                            const updated = { ...prev, endDate: e.target.value };
                                                            if (updated.startDate && updated.endDate) setShowCalendar(false);
                                                            return updated;
                                                        });
                                                        setErrors((prev) => ({ ...prev, duration: "" }));
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="font-semibold text-[18px] mb-4">
                                        Attach Images {formData.images.length}/10
                                    </h3>
                                    <div className="border border-[#858585] rounded-xl bg-white p-4">
                                        <div className="flex items-center gap-4">
                                            <label className="w-20 h-20 rounded-full border border-[#4B6B4E] flex items-center justify-center cursor-pointer shrink-0 self-center">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <X className="w-5 h-5" />
                                            </label>
                                            <div className="grid grid-cols-4 gap-x-4 gap-y-5 flex-1 border border-[#858585] rounded-xl p-4 min-h-30 items-center">
                                                {formData.images.map((img, index) => (
                                                    <div key={index} className="relative flex justify-center">
                                                        <img
                                                            src={img}
                                                            alt=""
                                                            className="w-19.25 h-[52.45px] rounded-sm object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                                                setFormData({
                                                                    ...formData,
                                                                    images: formData.images.filter((_, i) => i !== index),
                                                                });
                                                            }}
                                                            className="absolute -top-1.5 right-2 bg-[#1F4B2C] text-white rounded-full w-3 h-3 text-xs flex items-center justify-center"
                                                        >
                                                            <X />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-[18px] mb-3">Description</h3>
                                    <div className="relative">
                                        <textarea
                                            name="description"
                                            placeholder="Write here"
                                            value={formData.description}
                                            onChange={handleChange}
                                            maxLength={500}
                                            className={`w-full h-44 bg-white border rounded-xl p-5 outline-none resize-none text-sm
                                                ${errors.description ? "border-red-500" : "border-[#E5E5E5]"}`}
                                        ></textarea>
                                        <span className="absolute bottom-4 right-4 text-xs text-gray-400">
                                            {formData.description.length}/500
                                        </span>
                                    </div>
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div className="flex items-center justify-between mt-10">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-44 h-14 border border-[#EA7E24] text-[#EA7E24] rounded-xl hover:bg-[#EA7E24] hover:text-white transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNextStep2}
                                        className="w-44 h-14 bg-[#EA7E24] hover:bg-[#d66f1d] transition-all text-white rounded-xl"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="review-step space-y-8">
                            <h2 className="text-xl font-semibold mb-4 text-[#1A3F1E]">Fundraiser Details</h2>
                            <div className="review-card bg-white rounded-xl p-5 border border-[#858585]">
                                <div className="space-y-4">
                                    <div className="review-row">
                                        <span className="review-label">Fundraiser Title</span>
                                        <span className="review-value">{formData.title}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Choose Category</span>
                                        <span className="review-value">{getCategoryName()}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Location</span>
                                        <span className="review-value">{formData.location}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">City</span>
                                        <span className="review-value">{formData.city}</span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold mb-4 text-[#1A3F1E]">Amount Details</h2>
                            <div className="bg-white rounded-xl p-5 border border-[#858585]">
                                <div className="space-y-4">
                                    <div className="review-row">
                                        <span className="review-label">Amount</span>
                                        <span className="review-value">${formData.amount}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Duration Date</span>
                                        <span className="review-value">
                                            {formData.startDate} - {formData.endDate}
                                        </span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Images</span>
                                        <div className="review-value flex gap-3 flex-wrap">
                                            {formData.images.map((img, index) => (
                                                <img key={index} src={img} alt="" className="w-20 h-9 rounded-lg object-cover" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold mb-4 text-[#1A3F1E]">Description</h2>
                            <div className="bg-white rounded-xl p-5 border border-[#858585]">
                                <p className="text-gray-600 leading-7">{formData.description}</p>
                            </div>

                            <div className="flex items-center justify-between mt-10">
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-44 h-14 border border-[#EA7E24] text-[#EA7E24] rounded-xl hover:bg-[#EA7E24] hover:text-white transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="w-44 h-14 bg-[#EA7E24] hover:bg-[#d66f1d] transition-all text-white rounded-xl"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;