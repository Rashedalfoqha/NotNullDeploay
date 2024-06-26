const { pool } = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const register = async (req, res) => {
  const { username, email, password, user_type } = req.body;
  let role_id;

  if (user_type === "user") {
    role_id = 2;
  } else if (user_type === "company") {
    role_id = 1;
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user type"
    });
    return;
  }
  const bcryptPassword = await bcrypt.hash(password, Number(process.env.SALT));
  const query =
    "INSERT INTO users (username,email ,password,user_type,role_id) VALUES ($1,$2,$3,$4,$5)";
  const values = [
    username.toLowerCase(),
    email.toLowerCase(),
    bcryptPassword,
    user_type,
    role_id
  ];
  pool
    .query(query, values)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "created email successfully",
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(409).json({
        success: false,
        massage: "The email already exited",
        err: err.message
      });
      console.log(err);
    });
};

const login = (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const query = `SELECT * FROM users WHERE email = $1 `;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].id,
              username: result.rows[0].email,
              role: result.rows[0].role_id
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId: result.rows[0].id
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err
      });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE id= $1`;
  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json({
        message: `users id = ${id}`,
        result: result.rows
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
      console.log(err);
    });
};
const getUserByToken = (req, res) => {
  const id = req.token.userId;
  const query = `SELECT * FROM users WHERE id= $1`;
  pool
    .query(query, [id])
    .then((result) => {
      res.status(200).json({
        message: `users id = ${id}`,
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(500).json(err.message);
      console.log(err);
    });
};
const updateUserById = (req, res) => {
  const id = req.token.userId;
  const { email, username, photo, about, job_title } = req.body;
  const query = `UPDATE users SET email = COALESCE($1, email), username = COALESCE($2, username),photo = COALESCE($3, photo),about = COALESCE($4, about),job_title = COALESCE($5, job_title) WHERE id = $6 RETURNING *`;
  const data = [email, username, photo, about, job_title, id];
  pool
    .query(query, data) 
    .then((result) => {
      res.status(202).json({
        message: `Modified user id =${id}  `,
        result: result.rows
      });
    })
    .catch((err) => {
      res.json(err.message);
      console.log(err);
    });
};

module.exports = {
  register,
  login,
  getUserById,
  updateUserById,
  getUserByToken
};
