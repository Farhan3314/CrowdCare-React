import React, { useState } from "react";
import { FaSearch, FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDeleteCampaignMutation } from "../API/campaignApi";
import { useMergedCampaigns } from "../API/useMergedCampaigns";

const NoDataFound = "/assets/images/No data-amico 1.png";

const MyCampaigns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);

  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(
    location.state?.campaign || null
  );

  const { campaigns: rawCampaigns } = useMergedCampaigns();
  const campaigns = rawCampaigns.map((item) => ({
    ...item,
    status: item.status || "active",
  }));

  const [deleteCampaign] = useDeleteCampaignMutation();

  const handleDeleteCampaign = async (id) => {
    try {
      if (String(id).startsWith("local_")) {
        const existing = JSON.parse(localStorage.getItem("localCampaigns") || "[]");
        localStorage.setItem(
          "localCampaigns",
          JSON.stringify(existing.filter((c) => c._id !== id))
        );
        setSelectedCampaign(null);
        return;
      }
      await deleteCampaign(id).unwrap();
      const existing = JSON.parse(localStorage.getItem("localCampaigns") || "[]");
      localStorage.setItem(
        "localCampaigns",
        JSON.stringify(existing.filter((c) => c._id !== id))
      );
      setSelectedCampaign(null);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredCampaigns = campaigns.filter((item) => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const itemStatus = (item.status || "active").toString().toLowerCase();
    return matchesSearch && itemStatus === activeTab.toLowerCase();
  });

  if (!selectedCampaign) {
    return (
      <div className="w-full min-h-screen bg-white px-4 sm:px-6 md:px-10 lg:px-20 xl:px-35 py-6 md:py-10">
        <h1 className="hidden sm:block text-[20px] font-semibold text-[#1A1A1A] mb-6">
          My Campaigns
        </h1>

        <div className="w-full bg-white rounded-full h-11 px-5 flex items-center border border-[#E5E7EB] mb-5 shadow-none">
          <FaSearch className="text-[#9CA3AF] text-[14px]" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full bg-transparent outline-none ml-3 text-[14px] text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* Tabs */}
        <div className="border border-[#1A3F1E] rounded-xl p-1.5 flex flex-row bg-white mb-5">
          <button
            onClick={() => setActiveTab("active")}
            className={`w-1/2 h-10 rounded-md text-[14px] font-medium transition-all duration-300
              ${activeTab === "active" ? "bg-[#1A3F1E] text-white" : "text-gray-500"}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`w-1/2 h-10 rounded-md text-[14px] font-medium transition-all duration-300
              ${activeTab === "pending" ? "bg-[#1A3F1E] text-white" : "text-gray-500"}`}
          >
            Pending
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filteredCampaigns.map((item, index) => {
            const target = item.target || item.amount || 0;
            const raised = item.raised || 0;
            const progress = target > 0 ? Math.round((raised / target) * 100) : 0;

            return (
              <div
                key={item.id || index}
                onClick={() => {
                  localStorage.setItem("selectedCampaign", JSON.stringify(item));
                  setSelectedCampaign(item);
                }}
                className="
                  bg-white rounded-2xl border border-gray-100 cursor-pointer
                  hover:shadow-sm transition-all duration-200
                  /* Shared: always horizontal flex */ flex-row items-center gap-3 p-3
                "
              >
                <div className="
                  w-19.5 h-19.5 sm:w-28 sm:h-20
                  rounded-xl overflow-hidden shrink-0 bg-gray-100
                ">
                  {item.images && item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-1">
                    <h2 className="text-[13px] sm:text-[15px] font-medium text-[#1A1A1A] leading-tight line-clamp-2">
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-gray-500 shrink-0 ml-1 mt-0.5">
                      %{progress}
                    </span>
                  </div>

                  <div className="w-full h-0.75 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E3E26] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Date + Location */}
                  <div className="flex justify-between items-end mt-0.5">
                    <div>
                      <p className="text-gray-400 font-light text-[10px] leading-tight">
                        Duration Date
                      </p>
                      <p className="text-gray-700 text-[11px] font-normal leading-tight">
                        {item.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 font-light text-[10px] leading-tight">
                        {item.location}
                      </p>
                      <p className="text-gray-700 text-[11px] font-medium leading-tight">
                        {item.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCampaigns.length === 0 && (
            <div className="flex flex-col items-center pt-10">
              <img src={NoDataFound} alt="No Data Found" className="w-67.5 h-67.5" />
              <div className="text-center text-gray-500 mt-2">
                No data available to show <br />
                Please search
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const progress =
    selectedCampaign.target > 0
      ? Math.round((selectedCampaign.raised / selectedCampaign.target) * 100)
      : 0;

  return (
    <div className="w-full min-h-screen bg-white
      px-0 sm:px-6 md:px-10 lg:px-20 xl:px-35
      py-0 sm:py-6 md:py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-none sm:rounded-2xl">

        <div className="relative w-full h-72 sm:h-90 rounded-none sm:rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
          {selectedCampaign.images && selectedCampaign.images.length > 0 ? (
            <img
              src={selectedCampaign.images[0]}
              alt={selectedCampaign.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("selectedCampaign");
              setSelectedCampaign(null);
            }}
            className="absolute top-4 left-4 w-9 h-9 bg-black/30 hover:bg-gray-600/60 text-white rounded-md flex items-center justify-center transition-all"
          >
            <FaArrowLeft className="text-xs" />
          </button>

          <button
            onClick={() => handleDeleteCampaign(selectedCampaign._id)}
            className="absolute top-4 right-4 w-9 h-9 bg-black/30 hover:bg-red-600/60 text-red-400 hover:text-white rounded-md flex items-center justify-center transition-all"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>

        <div className="px-4 sm:px-0 mt-6">
          <h1 className="text-[20px] font-semibold text-[#1A1A1A]">
            {selectedCampaign.title}
          </h1>
          <p className="text-[13px] text-gray-400 font-light mt-2 leading-6 text-justify">
            {selectedCampaign.description}
          </p>
        </div>

        <div className="px-4 sm:px-0 flex flex-row justify-between items-start gap-4 mt-6">
          <div>
            <p className="text-[12px] text-gray-400 font-light">Total Fundraise</p>
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mt-0.5">
              $ {selectedCampaign.raised || 0}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-gray-400 font-light">Target Amount</p>
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mt-0.5">
              $ {selectedCampaign.target || 0}
            </h2>
          </div>
        </div>

        <div className="px-4 sm:px-0 mt-4">
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1E3E26]" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-right mt-1">
            <span className="text-[11px] text-gray-500 font-medium">%{progress}</span>
          </div>
        </div>

        <div className="px-4 sm:px-0 flex flex-row justify-between items-start gap-4 mt-4 pt-2">
          <div>
            <p className="text-[11px] text-gray-400 font-light mb-0.5">
              {selectedCampaign.location}
            </p>
            <p className="text-[15px] font-semibold text-gray-800">{selectedCampaign.city}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 font-light mb-0.5">Duration Date</p>
            <p className="text-[14px] font-medium text-gray-800">{selectedCampaign.duration}</p>
          </div>
        </div>

        <div className="px-4 sm:px-0 flex sm:flex-row gap-4 mt-8 pb-8">
          <button
            onClick={() =>
              navigate("/Campaign/CreateCampaign", {
                state: { editData: selectedCampaign },
              })
            }
            className="flex-1 h-12 border border-[#1A3F1E] text-[#1A3F1E] font-medium rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            Edit
          </button>
          <button
            onClick={() =>
              navigate("/donation/receipt", {
                state: { campaign: selectedCampaign },
              })
            }
            className="flex-1 h-12 bg-[#1A3F1E] text-white font-medium rounded-xl hover:bg-[#152c1b] transition-all text-sm"
          >
            Donate
          </button>
        </div>

      </div>
    </div>
  );
};

export default MyCampaigns;