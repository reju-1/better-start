import baseApi from "./baseApi";

export const companyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    registerCompany: build.mutation({
      query: (data) => ({
        url: "/company/create",
        method: "POST",
        data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useRegisterCompanyMutation } = companyApi;
