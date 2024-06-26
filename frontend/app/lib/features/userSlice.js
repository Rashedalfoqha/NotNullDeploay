"use client";
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {}
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    }
  }
});
export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
