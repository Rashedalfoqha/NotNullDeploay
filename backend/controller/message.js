const { pool } = require("../models/db");
const createNewMessage = (req, res) => {
  const { messages } = req.body;
  const receiver_id = req.params.id;
  const sender_id = req.token.userId;
  const value = [receiver_id, sender_id, messages];
  const query = `INSERT INTO messages (receiver_id, sender_id, messages) VALUES ($1, $2, $3) RETURNING *`;
  if (!receiver_id) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID is required."
    });
  }
  pool
    .query(query, value)
    .then((result) => {
      res.status(200).json({
        success: true,
        messages: "send Message Successfully",
        result: result.rows
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
};
const getAllMessage = (req, res) => {
  const { id } = req.params;
  const sender_id = req.token.userId;
  const query = `
    SELECT messages.*, sender.id AS sender_id, receiver.id AS receiver_id
    FROM messages
    JOIN users AS sender ON messages.sender_id = sender.id
    JOIN users AS receiver ON messages.receiver_id = receiver.id
    WHERE (sender.id = $1 AND receiver.id = $2) OR (receiver.id = $1 AND sender.id = $2);
  `;
  const values = [sender_id, id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Get messages successfully",
        result: result.rows
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
};

module.exports = {
  createNewMessage,
  getAllMessage
};
