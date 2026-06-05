import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Check } from "lucide-react";

const logo = "/assets/images/LOGO-CROWDCAREAID_2-removebg-preview 1.png";

const DonationReceipt = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const campaign = location.state?.campaign;
    const donatedAmount = location.state?.amount;

    const categoryName =
        typeof campaign?.category === "object"
            ? campaign?.category?.name || "—"
            : campaign?.category || "—";

    const duration =
        campaign?.duration ||
        (campaign?.startDate && campaign?.endDate
            ? `${campaign.startDate} - ${campaign.endDate}`
            : "—");

    const downloadForm = async () => {
        const element = document.getElementById("receipt");

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const pdf = new jsPDF("p", "mm", "a4");

        const imgData = canvas.toDataURL("image/png");

        const width = pdf.internal.pageSize.getWidth();

        const height =
            (canvas.height * width) /
            canvas.width;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            width,
            height
        );

        pdf.save("Donation-Receipt.pdf");
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center px-4 py-10">
            <div
                id="receipt"
                className="bg-white w-full max-w-2xl rounded-xl shadow-sm p-5 sm:p-8"
            >
                <img src={logo} alt="logo" className="h-10 mb-8" />

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#1A3F1E] flex items-center justify-center">
                        <Check className="text-white w-14 h-14" />
                    </div>
                    <h2 className="text-[18px] font-medium mt-5">
                        Successfully Send Amount
                    </h2>
                </div>

                <div className="bg-[#FAFAFA] rounded-xl p-6 mt-8 border border-[#ECECEC]">
                    <div className="space-y-5 text-[14px]">

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Campaign Name</span>
                            <span className="font-medium">{campaign?.title || "—"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Location</span>
                            <span className="font-medium">{campaign?.location || "—"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">City</span>
                            <span className="font-medium">{campaign?.city || "—"}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Duration</span>
                            <span className="font-medium">{duration}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Target Amount</span>
                            <span className="font-medium">${campaign?.target || 0}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Send Amount</span>
                            {/* ← hardcoded $500 ki jagah actual amount */}
                            <span className="font-medium">${donatedAmount || campaign?.raised || 0}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Status</span>
                            <span className="text-[#15803D] font-medium">Success</span>
                        </div>

                        <div className="border-t border-dashed pt-5 mt-5"></div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Send Date</span>
                            <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Transaction ID</span>
                            <span className="font-medium">
                                #{Math.floor(10000000 + Math.random() * 90000000)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Category</span>
                            {/* ← _id ki jagah name show ho raha hai */}
                            <span className="font-medium">{categoryName}</span>
                        </div>

                    </div>
                </div>

                <div
                    className="flex gap-5 mt-8"
                    data-html2canvas-ignore="true"
                >
                    <button
                        onClick={() => navigate("/dashboard/home")}
                        className="flex-1 h-12 border border-[#1A3F1E] text-[#1A3F1E] rounded-xl font-medium hover:bg-[#F3F4F6] transition-all"
                    >
                        Back to Home
                    </button>

                    <button
                        onClick={downloadForm}
                        className="flex-1 h-12 bg-[#1A3F1E] text-white rounded-xl font-medium hover:bg-[#122b15] transition-all"
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationReceipt;