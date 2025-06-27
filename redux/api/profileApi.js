import baseApi from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateProfile: build.mutation({
      query: (data) => ({
        url: "/user/",
        method: "PATCH",
        data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useUpdateProfileMutation } = profileApi;
