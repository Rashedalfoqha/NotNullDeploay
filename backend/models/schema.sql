CREATE TABLE roles (
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
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(255),
  role_id INT,
  is_deleted SMALLINT DEFAULT 0,
  about TEXT,
  job_title VARCHAR(255),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  photo VARCHAR(255),
  cover VARCHAR(255),
  description VARCHAR(255),
  user_id INT,
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
INSERT INTO roles (role)
VALUES ('company');
INSERT INTO permissions (permission)
VALUES ('CREATE_USER');
INSERT INTO permissions (permission)
VALUES ('UPDATE_TICKET');
INSERT INTO permissions (permission)
VALUES ('DELETE_USER');
INSERT INTO permissions (permission)
VALUES ('CREATE_TICKET');
INSERT INTO permissions (permission)
VALUES ('DELETE_TICKET');
INSERT INTO permissions (permission)
VALUES ('UPDATE_USER');
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 1);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 2);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 3);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 4);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 5);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 6);
INSERT INTO roles (role)
VALUES ('USER');
INSERT INTO permissions (permission)
VALUES ('CREATE_TICKET');
INSERT INTO permissions (permission)
VALUES ('UPDATE_TICKET');
INSERT INTO permissions (permission)
VALUES ('DELETE_USER');
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 1);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 2);
INSERT INTO role_permission (role_id, permission_id)
VALUES (1, 3);