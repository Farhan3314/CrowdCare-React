import React, { useState } from "react";
import { FaChevronUp, FaChevronDown, FaSearch, } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useMergedCampaigns } from "../API/useMergedCampaigns";


const NoDataFound = "/assets/images/No data-amico 1.png";

const DonationHistory = () => {
    const [activeTab, setActiveTab] = useState("fundraiser");
    const [openCards, setOpenCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const { campaigns: allCampaigns, isLoading } = useMergedCampaigns();
    const campaigns = allCampaigns.filter((item) => (item.status || "active") === "active");

    const toggleCard = (index) => {
        setOpenCards((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const filteredCampaigns = campaigns.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (

        <div className="w-full min-h-screen bg-white px-35 max-sm:px-4 py-10 max-sm:py-6">
            <h1 className="text-[30px] max-sm:text-[22px] font-bold text-[#1A3F1E] font-serif mb-6 max-sm:mb-4">
                Payment Details
            </h1>
            <div className="border border-[#1A3F1E] rounded-md p-1.5 bg-white flex mb-6 max-sm:mb-4">
                <button
                    onClick={() => {
                        setActiveTab("fundraiser");
                        setOpenCards([]);
                    }}
                    className={`w-1/2 h-9 max-sm:h-8 rounded-md text-[12px] max-sm:text-[11px] font-medium transition-all duration-300
                    ${activeTab === "fundraiser"
                            ? "bg-[#1A3F1E] text-white"
                            : "text-[#1A3F1E]"
                        }`}
                >
                    Fundraiser Details
                </button>
                <button
                    onClick={() => {
                        setActiveTab("donation");
                        setOpenCards([]);
                    }}
                    className={`w-1/2 h-9 max-sm:h-8 rounded-md text-[12px] max-sm:text-[11px] font-medium transition-all duration-300
                    ${activeTab === "donation"
                            ? "bg-[#1A3F1E] text-white"
                            : "text-[#1A3F1E]"
                        }`}
                >
                    Donation Details
                </button>
            </div>

            <div className="flex items-center gap-4 max-sm:gap-3 mb-8 max-sm:mb-5">
                <div className="flex-1 h-11 max-sm:h-10 bg-white border border-[#E6E6E6] rounded-full px-4 max-sm:px-3 flex items-center shadow-sm">
                    <FaSearch className="text-[#B8B8B8] text-[13px] max-sm:text-[12px] shrink-0" />
                    <input
                        type="text" placeholder="Search" value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        className="w-full ml-3 max-sm:ml-2 outline-none bg-transparent text-[13px] max-sm:text-[12px]"
                    />
                </div>
                <button className="text-[#17361F] text-[28px] max-sm:text-[24px] shrink-0"> <FiFilter /></button>
            </div>

            <div className="space-y-6 max-sm:space-y-4">
                {filteredCampaigns.map((item, index) => {
                    const isOpen = openCards.includes(index);
                    const target = item.target || item.amount || 0;
                    const raised = item.raised || 0;

                    const progress =
                        target > 0
                            ? Math.round(
                                (raised / target) * 100
                            )
                            : 0;
                    return (
                        <div
                            key={item._id || item.id}
                            className="bg-white border border-[#EAEAEA] rounded-md p-5 max-sm:p-4 shadow-sm transition-all duration-300"
                        >
                            <div className="flex justify-between items-start">
                                <div className="w-full pr-2">
                                    <h2 className="text-[15px] max-sm:text-[13px] font-semibold text-[#17361F] leading-snug">
                                        {item.title}
                                    </h2>
                                    {isOpen && (
                                        <>
                                            <p className="text-[11px] max-sm:text-[10px] leading-4.5 text-[#6F6F6F] mt-3 max-w-155 max-sm:max-w-full">
                                                {item.description}
                                            </p>
                                            <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                                                {item.images &&
                                                    item.images.length > 0 ? (
                                                    item.images.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img}
                                                            alt={`campaign-${i}`}
                                                            className="w-16 h-12 max-sm:w-14 max-sm:h-10 rounded object-cover shrink-0 border"
                                                        />
                                                    ))
                                                ) : (
                                                    <p className="text-[11px] text-gray-400">
                                                        No Images
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        toggleCard(index)
                                    }
                                    className="text-[#F59E0B] ml-3 mt-1 shrink-0"
                                >
                                    {isOpen ? (
                                        <FaChevronUp className="text-[12px]" />
                                    ) : (
                                        <FaChevronDown className="text-[12px]" />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-between mt-5 max-sm:mt-4">
                                <div>
                                    <p className="text-[10px] max-sm:text-[9px] text-[#A0A0A0]">
                                        Amount Target
                                    </p>
                                    <h3 className="text-[20px] max-sm:text-[17px] font-semibold text-[#17361F] mt-1">
                                        ${item.target || item.amount || 0}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] max-sm:text-[9px] text-[#A0A0A0]">
                                        Fundraiser
                                    </p>
                                    <h3 className="text-[20px] max-sm:text-[17px] font-semibold text-[#17361F] mt-1">
                                        ${item.raised}
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="w-full h-0.5 bg-[#DADADA] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#1A3F1E]"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-[#1A3F1E]">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                            {isOpen && (
                                <>
                                    {activeTab === "donation" ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 max-sm:gap-y-4 mt-5 max-sm:mt-4">
                                            <div>
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Duration Date
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1 wrap-break-word">
                                                    {item.duration}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Location
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1 wrap-break-word">
                                                    {item.location}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Debit Card
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1 wrap-break-word">
                                                    {item.card}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Amount
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1">
                                                    ${item.amount}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Day / Date
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1 wrap-break-word">
                                                    {item.day}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Time
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1">
                                                    {item.time}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-y-5 max-sm:gap-y-4 mt-5 max-sm:mt-4">
                                            <div>
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Duration Date
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1 wrap-break-word">
                                                    {item.duration}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] max-sm:text-[9px] text-[#A7A7A7]">
                                                    Location
                                                </p>
                                                <p className="text-[11px] max-sm:text-[10px] text-[#1A3F1E] mt-1 wrap-break-word">
                                                    {item.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="flex justify-center mt-5 max-sm:mt-4">
                                <button
                                    onClick={() =>
                                        toggleCard(index)
                                    }
                                    className="w-7 h-7 max-sm:w-6 max-sm:h-6 rounded-full bg-[#D9D9D9] flex items-center justify-center transition-all duration-300"
                                >
                                    {isOpen ? (
                                        <FaChevronUp className="text-[#1A3F1E] text-[10px] max-sm:text-[9px]" />
                                    ) : (
                                        <FaChevronDown className="text-[#1A3F1E] text-[10px] max-sm:text-[9px]" />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
                {filteredCampaigns.length === 0 && (
                    <div className=" flex flex-col items-center">
                        <img src={NoDataFound} alt="No Data Found"
                            className="w-67.5 h-67.5 max-sm:w-48 max-sm:h-48"
                        />
                        <div className="text-center text-gray-500 max-sm:text-[13px]">
                            No data available to show <br />
                            Please search
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default DonationHistory;