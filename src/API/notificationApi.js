import { baseApi } from "./BaseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getUserNotifications: builder.query({
            query: () => ({
                url: "/getUserNotifications",
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),

    }),
});

export const {
    useGetUserNotificationsQuery,
} = notificationApi;