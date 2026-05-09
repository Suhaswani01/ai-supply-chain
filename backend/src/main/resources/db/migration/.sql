CREATE TABLE parts (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    part_code    VARCHAR(100) NOT NULL UNIQUE,
    category     VARCHAR(100) NOT NULL,
    quantity     INT NOT NULL DEFAULT 0,
    unit_price   DOUBLE NOT NULL,
    stock_status ENUM('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK') NOT NULL,
    supplier_id  BIGINT,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

INSERT INTO parts (name, part_code, category, quantity, unit_price, stock_status, supplier_id) VALUES
('RTX 4070', 'P-001', 'GPU', 9, 45000, 'LOW_STOCK', 1),
('i9-13900K', 'P-002', 'CPU', 45, 65000, 'IN_STOCK', 2),
('USB-C Hub', 'P-003', 'Accessories', 3, 2500, 'LOW_STOCK', 1),
('32GB RAM', 'P-004', 'Memory', 28, 12000, 'IN_STOCK', 3);