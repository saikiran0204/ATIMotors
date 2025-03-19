import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";  // Ensure this path matches your auth slice

const store = configureStore({
  reducer: {
    auth: authReducer,  
  },
});

export default store;
