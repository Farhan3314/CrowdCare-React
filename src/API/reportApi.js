import { baseApi } from "./BaseApi";

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createReport: builder.mutation({
            query: (data) => ({
                url: "/createReport",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Reports"],
        }),

        getReports: builder.query({
            query: () => ({
                url: "/getReports",
                method: "GET",
            }),
            providesTags: ["Reports"],
        }),

        deleteReport: builder.mutation({
            query: (id) => ({
                url: `/deleteReport/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Reports"],
        }),

    }),
});

export const {
    useCreateReportMutation,
    useGetReportsQuery,
    useDeleteReportMutation,
} = reportApi;