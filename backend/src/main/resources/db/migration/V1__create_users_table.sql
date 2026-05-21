CREATE TABLE users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     ENUM('ROLE_ADMIN', 'ROLE_INVENTORY_MANAGER', 'ROLE_VIEWER') NOT NULL
);

INSERT INTO users (email, password, role) VALUES
('admin@test.com',
 '121166top',
 'ROLE_ADMIN');
 INSERT INTO users (email, password, role) VALUES
('manager@test.com',
 '$2a$12$tQNOR/ZMbSuE5QmJxzLnzuL5FBWmMRKAMkGEbGnGwFJlLzCuHAEWO',
 'ROLE_INVENTORY_MANAGER');