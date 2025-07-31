// In your userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunk/authService";
import type { IProfileData } from "../thunk/types/authTypes";
import { logoutUser } from "../thunk/authService";

interface IInitialState {
  user: IProfileData | null ;
  loading: boolean;
  error?: string | null;
}

const initialState: IInitialState = {
  user: null,
  loading: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserError: (state, action) => {
      state.error = action.payload;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { setUser, setUserError, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
