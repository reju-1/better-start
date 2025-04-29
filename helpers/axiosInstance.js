import axios from "axios";
import { getFromLocalStorage } from "@/utils/local-storage";

const axiosInstance = axios.create();

axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.defaults.headers["Accept"] = "application/json";
axiosInstance.defaults.timeout = 60000;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(process.env.NEXT_PUBLIC_AUTH_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    const responseData = response.data;
    const successResponse = {
      success: true,
      statusCode: responseData.statusCode,
      message: responseData.message,
      meta: responseData.meta,
      data: responseData.data,
    };
    response.data = successResponse;
    return response;
  },
  async function (error) {
    const errorResponse = {
      success: false,
      statusCode: error?.response?.data?.statusCode || 500,
      message:
        error?.response?.data?.message ||
        "Something went wrong. Please try again.",
      errorDetails: error?.response?.data?.errorDetails || {},
    };
    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
