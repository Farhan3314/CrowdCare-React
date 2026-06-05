import { useSelector } from "react-redux";
import { useGetAllCampaignsQuery } from "./campaignApi";

export const useMergedCampaigns = () => {
    const token = useSelector((state) => state.auth.token);
    const currentUser = useSelector((state) => state.auth.user);
    const currentUserId = currentUser?._id || currentUser?.id;

    const {
        data,
        isLoading,
        error,
        refetch,
    } = useGetAllCampaignsQuery(undefined, {
        skip: !token,
    });

    const allApiCampaigns = data?.data || [];
    const apiCampaigns = currentUserId
        ? allApiCampaigns.filter(
            (c) =>
                c.user === currentUserId ||
                c.user?._id === currentUserId ||
                c.createdBy === currentUserId ||
                c.createdBy?._id === currentUserId
        )
        : allApiCampaigns;

    const localCampaigns = (() => {
        try {
            const stored = JSON.parse(
                localStorage.getItem("localCampaigns") || "[]"
            );

            if (apiCampaigns.length > 0) {
                const apiIds = new Set(apiCampaigns.map((c) => c._id));
                return stored.filter((c) => !apiIds.has(c._id));
            }

            return stored;
        } catch {
            return [];
        }
    })();

    const normalizedCampaigns = [
        ...apiCampaigns,
        ...localCampaigns,
    ].map((item) => ({
        ...item,

        duration:
            item.duration ||
            (item.startDate && item.endDate
                ? `${item.startDate} - ${item.endDate}`
                : "N/A"),

        target:
            item.target ||
            item.amount ||
            0,

        raised:
            item.raised ||
            0,

        status:
            item.status ||
            "active",
    }));

    return {
        campaigns: normalizedCampaigns,
        isLoading: token ? isLoading : false,
        error,
        refetch,
    };
};