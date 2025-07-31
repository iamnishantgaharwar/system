import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";
import { setUser, setUserError, setUserLoading } from "../slice/userSlice"; // We only manually dispatch this one

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue, dispatch }) => {
    try {
    dispatch(setUserLoading(true))
      const res = await apiClient.me();
      const responseData = res.data;

      if (!responseData.success) {
        dispatch(setUserError(responseData.error || "Failed to fetch profile"));
        return rejectWithValue(responseData.error || "Failed to fetch profile");
      }
      dispatch(setUser(responseData.data))
      localStorage.setItem('user', JSON.stringify(responseData.data))
      return responseData.data;

    } catch (err) {
      const error = err as Error;
      dispatch(setUserError(error.message));
      dispatch(setUserLoading(false))
      return rejectWithValue(error.message || "Uncaught Error");
    } finally {
      dispatch(setUserLoading(false))
    }
  }
);
