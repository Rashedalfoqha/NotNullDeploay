const { Pool } = require("pg");
const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString
});
pool
  .connect()
  .then((res) => {
    console.log(`DB connected to ${res.database}`);
  })
  .catch((err) => {
    console.log(err);
  });
const createTable = (req, res) => {
  pool
    .query(
      `CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        role VARCHAR(255) NOT NULL
      );
      CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        permission VARCHAR(255) NOT NULL
      );
      CREATE TABLE role_permission (
        id SERIAL PRIMARY KEY,
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
      );
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        photo VARCHAR(255),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        company_id INT,
        role_id INT,
        is_deleted SMALLINT DEFAULT 0,
        FOREIGN KEY (company_id) REFERENCES company(id),
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );
      CREATE TABLE company (
        id SERIAL PRIMARY KEY,
        companyName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT,
        is_deleted SMALLINT DEFAULT 0,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );
      CREATE TABLE tickets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        photo VARCHAR(255),
        cover VARCHAR(255),
        description VARCHAR(255), user_id INT,
        priority VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_at TIMESTAMP,
        is_deleted SMALLINT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE workspaces (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        ticket_id INT,
        member_id INT,
        photo VARCHAR(255),
        is_deleted SMALLINT DEFAULT 0,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id),
        FOREIGN KEY (member_id) REFERENCES users(id)
      );
      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY,
        ticket_id INT,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
      );
    `
    )
    .then((result) => {
      console.log("created");
    }) 
    .catch((err) => {
      console.log(err.message);
    });
};
// createTable()

module.exports = { pool };
