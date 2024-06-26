import { createSlice } from "@reduxjs/toolkit";

export const ticket = createSlice({
  name: "ticket",
  initialState: {
    tickets:[],
  },
  reducers: {
    setTickets: (state, action) => {
        state.tickets = action.payload;
      },
      createNewTicket: (state, action) => {
        state.tickets = [action.payload, ...state.tickets];
      },
      updateTicketById: (state, action) => {
        state.tickets = state.tickets.map((elem, ind) => {
          if (elem.id === action.payload.id) {
            console.log(action.payload);
            return { ...elem, ...action.payload };
          }
          return elem;
        });
      },
      deleteTicket: (state, action) => {
        state.tickets = state.tickets.filter(
          (id, index) => id.id !== action.payload
        )
      },
  }
});
export const {
    setTickets,
    createNewTicket,
    updateTicketById,
    deleteTicket
} = ticket.actions;
export default ticket.reducer;