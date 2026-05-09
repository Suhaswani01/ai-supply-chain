CREATE TABLE purchase_orders (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    po_number    VARCHAR(100) NOT NULL UNIQUE,
    part_id      BIGINT NOT NULL,
    supplier_id  BIGINT NOT NULL,
    quantity     INT NOT NULL,
    total_amount DOUBLE NOT NULL,
    status       ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at   DATETIME NOT NULL,
    updated_at   DATETIME,
    FOREIGN KEY (part_id) REFERENCES parts(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

INSERT INTO purchase_orders (po_number, part_id, supplier_id, quantity, total_amount, status, created_at) VALUES
('PO-5512', 1, 1, 10, 450000, 'PENDING', NOW()),
('PO-5513', 4, 3, 50, 125000, 'PENDING', NOW()),
('PO-5514', 2, 2, 20, 80000, 'PENDING', NOW());