const express = require("express");
const {createTicket, deleteTicket, updateTicket, selectTicketForUserId, selectTicketByUserId, favoriteTicket, removeFavoriteTicket} = require("../controller/tickets");


const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const ticketRouter = express.Router();

ticketRouter.post("/create",authentication,createTicket);
ticketRouter.delete("/delete/:id",authentication,deleteTicket);
ticketRouter.put("/update/:ticket_id",authentication,updateTicket);
ticketRouter.get("/all",authentication,selectTicketForUserId);
ticketRouter.get("/all/:id",selectTicketByUserId);

ticketRouter.post("/favorite/:id",favoriteTicket);
ticketRouter.delete("/favorite/delete/:id",removeFavoriteTicket);

module.exports = ticketRouter; 