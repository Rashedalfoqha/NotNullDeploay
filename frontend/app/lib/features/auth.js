import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  if (typeof window !== "undefined") {
    // Check if localStorage is available
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    return {
      token: token || null,
      userId: userId || null,
      isLoggedIn: !!token,
    };
  }

  // If running on the server, return default state
  return {
    token: null,
    userId: null,
    isLoggedIn: false,
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", action.payload);
      }
    },
    setLogout: (state, action) => {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = false;
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    },
  },
});

export const { setLogin, setUserId, setLogout } = authSlice.actions;
export default authSlice.reducer;
