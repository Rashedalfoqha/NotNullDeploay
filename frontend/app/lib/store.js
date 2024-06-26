"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import authReducer from "./features/auth";
import ticketReducer from "./features/ticket";
import messageReducer from "./features/message";
export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    tickets: ticketReducer,
    message: messageReducer
  }
});
