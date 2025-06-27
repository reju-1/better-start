import axiosInstance from "./axiosInstance";
import qs from "qs";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers, contentType }) => {
    try {
      let requestData = data;
      let requestContentType = contentType || "application/json";

      if (contentType === "application/x-www-form-urlencoded" && data) {
        requestData = qs.stringify(data);
      }

      const response = await axiosInstance({
        url: baseUrl + url,
        method,
        data: requestData,
        params,
        headers: {
          "Content-Type": requestContentType,
          ...headers,
        },
      });

      return { data: response };
    } catch (axiosError) {
      return {
        error,
      };
    }
  };

export default axiosBaseQuery;
