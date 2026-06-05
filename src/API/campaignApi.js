import { baseApi } from "./BaseApi";

export const campaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllCampaigns: builder.query({
            query: () => "/getAllCampaigns",
            providesTags: ["Campaigns"],
        }),

        createCampaign: builder.mutation({
            query: (data) => ({
                url: "/createCampaign",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Campaigns"],
        }),

        updateCampaign: builder.mutation({
            query: ({ id, body }) => ({
                url: `/updateCampaign/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Campaigns"],
        }),

        deleteCampaign: builder.mutation({
            query: (id) => ({
                url: `/deleteCampaign/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Campaigns"],
        }),
    }),
});

export const {
    useGetAllCampaignsQuery,
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useDeleteCampaignMutation,
} = campaignApi;