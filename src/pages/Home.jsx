import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMergedCampaigns } from "../API/useMergedCampaigns";
import { useGetCategoriesQuery } from "../API/categoryApi";

const Banner = "/assets/images/BannerHome.jpeg";
const MedicalIcon = "/assets/category/Medical-Icon.png";
const EducationIcon = "/assets/category/Education-Icon.png";
const PovertyIcon = "/assets/category/Poverty-Icon.png";
const NoDataFound = "/assets/images/No data-amico 1.png";

const categories = [
  { id: 1, title: "Medical", icon: MedicalIcon },
  { id: 2, title: "Education", icon: EducationIcon },
  { id: 3, title: "Poverty", icon: PovertyIcon },
];

const CampaignCard = ({ item, navigate, getCategoryName }) => {
  const progressPercent =
    item?.target > 0 ? Math.round((item?.raised / item?.target) * 100) : 0;

  const isCompleted = progressPercent >= 100;

  const displayImage =
    item?.image ||
    (item?.images && item?.images[0]) ||
    "/assets/images/placeholder.jpeg";

  const categoryDisplay = getCategoryName(item?.category);

  return (
    <div className="bg-white rounded-md border border-[#858585] overflow-hidden flex flex-col justify-between">
      <div className="rounded-tr-md rounded-tl-md overflow-hidden h-48 sm:h-52 md:h-44 lg:h-48 w-full">
        <img
          src={displayImage}
          alt={item?.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="px-3">
        <h3 className="font-bold text-sm md:text-base text-gray-800 text-center flex-1 min-h-12.5 flex items-center justify-center px-2">
          {item?.title}
        </h3>

        <div className="text-right text-xs font-bold text-gray-700 mb-1 px-1">
          {progressPercent}%
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div
            className={`h-1.5 rounded-full ${isCompleted ? "bg-gray-400" : "bg-green-700"}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs mb-1 gap-2 flex-wrap">
          <div className="flex gap-1.5">
            <p className="text-[#858585]">Raised of</p>
            <p className="font-bold text-gray-800">${item?.raised || 0}</p>
          </div>
          <div className="flex gap-1.5">
            <p className="text-[#858585]">Target</p>
            <p className="font-bold text-gray-800">${item?.target}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 text-[11px] text-[#858585] mb-3 border-t border-gray-50 pt-1.5">
          <div>{categoryDisplay}</div>
          <div className="text-right">{item?.location || "New York"}</div>
        </div>

        <button
          onClick={() =>
            navigate("/myCampaigns", { state: { campaign: item } })
          }
          className={`w-4/7 mx-auto block h-10 text-white py-2 mb-3 rounded-lg text-[14px] font-medium transition ${isCompleted
            ? "bg-[#858585] hover:bg-[#858585]"
            : "bg-[#858585] hover:bg-[#1A3F1E]"
            }`}
        >
          View
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const { campaigns: rawCampaigns } = useMergedCampaigns();
  const campaigns = rawCampaigns.map((item) => ({
    ...item,
    status: item.status || "active",
  }));

  // Categories fetch karo taake _id → name resolve ho sake
  const { data: categoriesData } = useGetCategoriesQuery(undefined, {
    skip: !token,
  });

  // _id, object, ya plain name — teeno handle karo
  const getCategoryName = (category) => {
    if (!category) return "";
    if (typeof category === "object") return category.name || "";
    // Check karo ke yeh _id hai ya name
    const found = categoriesData?.data?.find((c) => c._id === category);
    if (found) return found.name;
    // Pehle se name hai (local campaigns)
    return category;
  };

  const filteredCampaigns = selectedCategory
    ? campaigns.filter((item) => {
      const catName = getCategoryName(item.category);
      return catName.toLowerCase() === selectedCategory.toLowerCase();
    })
    : campaigns;

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-35 py-6 md:py-10">
      <h2 className="text-[#EA7E24] text-2xl font-bold mb-6 font-serif">
        What Do you want to donate today?
      </h2>

      {/* Banner */}
      <div
        className="relative rounded-2xl overflow-hidden min-h-62.5 md:h-60 flex items-center px-6 md:px-10 lg:px-16 mb-8 md:mb-12"
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1A3F1E]/85"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 md:mb-5 font-serif tracking-wide">
            Start Your own Funding
          </h1>
          <button
            onClick={() => navigate("/Campaign/CreateCampaign")}
            className="bg-[#EA7E24] hover:bg-[#d97706] transition px-5 sm:px-8 py-3 rounded-xl font-semibold text-sm">
            Start Campaign
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A3F1E] mb-6 font-serif">
          Category
        </h2>

        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {categories.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === item.title ? null : item.title
                )
              }
              className={`bg-white rounded-2xl min-h-22.5 md:h-24 border flex items-center justify-center gap-3 md:gap-4 px-4 hover:shadow-md cursor-pointer transition-all ${selectedCategory === item.title
                ? "border-[#1A3F1E] ring-4 ring-[#1A3F1E]/10 bg-gray-50"
                : "border-gray-200 shadow-sm"
                }`}
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <h3 className="text-base md:text-lg font-semibold text-gray-700">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns */}
      <div>
        <h2 className="text-2xl font-bold text-[#1A3F1E] mb-6 font-serif">
          {selectedCategory ? `${selectedCategory} Fundraiser` : "Top Fundraiser"}
        </h2>

        {filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center">
            <img
              src={NoDataFound}
              alt="No Data Found"
              className="w-52 h-52 md:w-64 md:h-64"
            />
            <div className="text-center text-gray-500">
              No campaigns found{selectedCategory ? ` in ${selectedCategory}` : ""}.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                item={campaign}
                navigate={navigate}
                getCategoryName={getCategoryName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;