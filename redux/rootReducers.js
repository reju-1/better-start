import baseApi from "./api/baseApi";

const rootReducer = {
  [baseApi?.reducerPath]: baseApi?.reducer,
  user: persistedAuthReducer,
};

export default rootReducer;
