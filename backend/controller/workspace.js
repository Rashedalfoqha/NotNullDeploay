const { pool } = require("../models/db");

const addTicket = (req, res) => {
  const { ticket_id } = req.params;
  const { title, member, photo } = req.body;

  const query =
    "INSERT INTO workspaces (title,ticket_id,member_id,photo) VALUES ($1,$2,$3,$4)";
  const data = [title, ticket_id, member, photo];

  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        message: "Ticket was added",
        result: result
      });
    })
    .catch((err) => {
      throw err;
    });
};

const removeTicket = (req, res) => {
  const { ticket_id } = req.params;

  const query = "DELETE FROM workspaces WHERE ticket_id =$1";
  const data = [ticket_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        message: "Ticket was removed",
        result: result
      });
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  addTicket,
  removeTicket
};
