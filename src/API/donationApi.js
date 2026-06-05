import { baseApi } from "./BaseApi";

export const donationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        donate: builder.mutation({
            query: (data) => ({
                url: "/donate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Donations"],
        }),

        getMyDonationHistory: builder.query({
            query: () => ({
                url: "/myDonationHistory",
                method: "GET",
            }),
            providesTags: ["Donations"],
        }),

        getAllDonationHistory: builder.query({
            query: () => ({
                url: "/allDonationHistory",
                method: "GET",
            }),
            providesTags: ["Donations"],
        }),

        updateDonationStatus: builder.mutation({
            query: ({ id, data }) => ({
                url: `/updateDonationStatus/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Donations"],
        }),

        getCampaignDonators: builder.query({
            query: (id) => ({
                url: `/getCampaignDonators/${id}`,
                method: "GET",
            }),
            providesTags: ["Donations"],
        }),

    }),
});

export const {
    useDonateMutation,
    useGetMyDonationHistoryQuery,
    useGetAllDonationHistoryQuery,
    useUpdateDonationStatusMutation,
    useGetCampaignDonatorsQuery,
} = donationApi;