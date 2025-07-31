import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
import type { LoginRequestType } from "../../components/Auth/schema/auth";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginRequestType, { rejectWithValue }) => {
    try {
      const res = await apiClient.userlogin(payload);
      const responseData = res.data;

      if (!responseData.success) {
        const errMessage = responseData.error || "Login Failed";
        return rejectWithValue(errMessage);
      }
      const profileRes = await apiClient.me(); // GET /me
      const userData = profileRes.data.data;

      
      
      return {
        user: userData
      };
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.logout();
      const responseData = res.data;

      if (!responseData.success) {
        const errMessage = responseData.error || "Logout Failed";
        return rejectWithValue(errMessage);
      }
      
      return {
        user: null
      };
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

