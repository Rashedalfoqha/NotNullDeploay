import { createSlice } from "@reduxjs/toolkit";
const message = createSlice({
  name: "message",
  initialState: {
    message: []
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    createMessage: (state, action) => {
      state.message.push(action.payload);
    }
  }
});
export const { setMessage, createMessage, sendMessage } = message.actions;
export default message.reducer;
