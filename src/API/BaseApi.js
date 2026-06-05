import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://dev.api.crowdcareaid.com/api",

        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.token || localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: [
        "Profile",
        "Campaigns",
        "Categories",
        "Reports",
        "Donations",
    ],
    endpoints: () => ({}),
});