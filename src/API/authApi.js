import { baseApi } from "./BaseApi";
import { setCredentials, logout } from "../redux/features/authSlice";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        signup: builder.mutation({
            query: (userData) => ({
                url: "/signUp",
                method: "POST",
                body: userData,
            }),
        }),

        login: builder.mutation({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("TOKEN SAVED:", data?.data?.access_token);

                    // Naye user ka login — purani image clear karo
                    localStorage.removeItem("profileImageBase64");
                    localStorage.removeItem("profileImage");

                    dispatch(
                        setCredentials({
                            token: data?.data?.access_token,
                            user: data?.data,
                        })
                    );
                } catch (err) {
                    console.log("LOGIN ERROR:", err);
                }
            },
        }),

        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "/forgotPassword",
                method: "POST",
                body: data,
            }),
        }),

        otpVerification: builder.mutation({
            query: (data) => ({
                url: "/verifyOtp",
                method: "POST",
                body: data,
            }),
        }),

        resendOtp: builder.mutation({
            query: (data) => ({
                url: "/resendOTP",
                method: "POST",
                body: data,
            }),
        }),

        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/resetPassword",
                method: "POST",
                body: data,
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: "/changePassword",
                method: "POST",
                body: data,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;

                    // Logout pe image clear karo
                    localStorage.removeItem("profileImageBase64");
                    localStorage.removeItem("profileImage");

                    dispatch(logout());
                } catch (err) {
                    console.log("LOGOUT ERROR:", err);
                }
            },
        }),

        deleteAccount: builder.mutation({
            query: () => ({
                url: "/deleteAccount",
                method: "DELETE",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;

                    localStorage.removeItem("profileImageBase64");
                    localStorage.removeItem("profileImage");

                    dispatch(logout());
                } catch (err) {
                    console.log("DELETE ACCOUNT ERROR:", err);
                }
            },
        }),

        uploadImage: builder.mutation({
            query: (imageFile) => {
                const formData = new FormData();
                formData.append("image", imageFile);
                return {
                    url: "/uploadImage",
                    method: "POST",
                    body: formData,
                };
            },
        }),

        getImage: builder.query({
            query: (key) => ({
                url: `/getImage/${key}`,
                method: "GET",
                providesTags: ["Image"],
            }),
        }),

        getProfile: builder.query({
            query: () => ({
                url: "/getUserProfile",
                method: "GET",
            }),
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/editProfile",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useSignupMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useOtpVerificationMutation,
    useResendOtpMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useLogoutMutation,
    useDeleteAccountMutation,

    useUploadImageMutation,
    useGetImageQuery,

    useGetProfileQuery,
    useUpdateProfileMutation,

} = authApi;