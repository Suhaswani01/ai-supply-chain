CREATE TABLE suppliers (
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    email   VARCHAR(255) NOT NULL UNIQUE,
    phone   VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    rating  DOUBLE,
    status  ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE'
);

INSERT INTO suppliers (name, email, phone, address, rating, status) VALUES
('ABC Corp', 'abc@corp.com', '9876543210', 'Mumbai, Maharashtra', 4.5, 'ACTIVE'),
('XYZ Ltd', 'xyz@ltd.com', '9123456789', 'Pune, Maharashtra', 4.2, 'ACTIVE'),
('PQR Inc', 'pqr@inc.com', '9012345678', 'Delhi, India', 3.8, 'INACTIVE');