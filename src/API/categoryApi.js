import { baseApi } from "./BaseApi";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: `/getCategories`,
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),
    }),
});

export const { useGetCategoriesQuery } = categoryApi;