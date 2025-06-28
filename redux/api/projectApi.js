import { tagTypes } from "../tag-types";
import baseApi from "./baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation({
      query: (data) => ({
        url: "/kanban/projects/",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.project],
    }),

    getCompanyProjects: build.query({
      query: () => ({
        url: `/kanban/projects/by_company/`,
        method: "GET",
      }),
      providesTags: [tagTypes.project],
    }),
  }),

  overrideExisting: false,
});

export const { useCreateProjectMutation, useGetCompanyProjectsQuery } =
  projectApi;
