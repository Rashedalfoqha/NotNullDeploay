const express = require ('express');
const { addTicket, removeTicket } = require('../controller/workspace')

const workspaceRouter = express.Router();

workspaceRouter.post("/add/:id",addTicket);
workspaceRouter.delete('/remove/:id',removeTicket);

module.exports = workspaceRouter;