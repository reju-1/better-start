import baseApi from "./baseApi";

export const hrApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createJobPost: build.mutation({
      query: (data) => ({
        url: "/job/job-posts",
        method: "POST",
        data,
      }),
    }),

    getJobPosts: build.query({
      query: () => ({
        url: "/job/job-posts",
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useCreateJobPostMutation, useGetJobPostsQuery } = hrApi;
