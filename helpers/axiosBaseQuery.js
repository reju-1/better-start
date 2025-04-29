import axiosInstance from "./axiosInstance";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers, contentType }) => {
    try {
      const response = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": contentType || "Application/json",
          ...headers,
        },
      });
      return {
        data: response?.data,
      };
    } catch (axiosError) {
      const error = axiosError;
      return {
        error: {
          status: error?.statusCode,
          data: {
            message: error?.message,
            errorDetails: error?.errorDetails,
          },
        },
      };
    }
  };

export default axiosBaseQuery;
