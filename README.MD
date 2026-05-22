# AI Supply Chain Optimizer

A full-stack production-grade supply chain management system with AI-powered demand forecasting, risk scoring, and inventory management.

## Tech Stack

**Backend:** Java 21, Spring Boot 3.2, Spring Security (JWT), JPA/Hibernate, MySQL 8, Flyway  
**Frontend:** React.js, React Router, Axios  
**AI:** Moving Average Demand Forecasting, Risk Scoring Algorithm  
**Tools:** Maven, Git

## Features

### Role-Based Access Control
- **ROLE_ADMIN** — Full access: inventory CRUD, user management, PO approve/reject, AI insights
- **ROLE_INVENTORY_MANAGER** — Add/edit parts, raise POs, view forecasts
- **ROLE_VIEWER** — View dashboard, inventory list, download reports

### Core Modules
- JWT Authentication & Authorization
- Inventory Management (CRUD)
- Supplier Management
- Purchase Order — Create, Approve, Reject
- AI Demand Forecasting (Moving Average)
- Reorder Alerts
- Supplier Risk Scorer

## Project Structure
ai-supply-chain/
├── backend/                  # Spring Boot
│   ├── src/main/java/
│   │   └── com/supplychain/
│   │       ├── controller/   # REST APIs
│   │       ├── service/      # Business logic
│   │       ├── entity/       # JPA entities
│   │       ├── repository/   # Data access
│   │       ├── config/       # Security config
│   │       ├── filter/       # JWT filter
│   │       └── util/         # JWT utility
│   └── src/main/resources/
│       └── db/migration/     # Flyway SQL migrations
└── frontend/                 # React.js
└── src/
├── pages/            # Page components
├── components/       # Reusable components
├── hooks/            # Custom hooks
├── services/         # API calls
└── routes/           # Protected routes

## API Endpoints
POST   /api/auth/login                  — Login, returns JWT token
GET    /api/inventory                   — Get all parts
POST   /api/inventory                   — Add part
PUT    /api/inventory/{id}              — Update part
DELETE /api/inventory/{id}              — Delete part
GET    /api/suppliers                   — Get all suppliers
POST   /api/suppliers                   — Add supplier
GET    /api/purchase-orders             — Get all POs
POST   /api/purchase-orders             — Create PO
PUT    /api/purchase-orders/{id}/approve — Approve PO
PUT    /api/purchase-orders/{id}/reject  — Reject PO
GET    /api/ai/forecast                 — AI demand forecast
GET    /api/ai/alerts                   — Reorder alerts
GET    /api/ai/risk                     — Supplier risk scores

## Database Schema
users           — id, email, password, role
parts           — id, name, part_code, category, quantity, unit_price, stock_status, supplier_id
suppliers       — id, name, email, phone, address, rating, status
purchase_orders — id, po_number, part_id, supplier_id, quantity, total_amount, status
stock_usage     — id, part_id, used_qty, usage_date

## Setup & Run

### Prerequisites
- Java 21
- MySQL 8
- Node.js 18+
- Maven

### Backend
```bash
# MySQL database make 
CREATE DATABASE supply_chain_db;

# application.properties mein DB credentials seting
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend/login-frontend
npm install
npm start
```

### Default Login
Email    : admin@test.com
Password : password123

### Default Login for manager
Email    : manager@test.com
Password : password123



## Screenshots

> Dashboard, Inventory, PO Management, AI Insights pages

## Author

**Suhas Wani**  
[GitHub](https://github.com/Suhaswani01) 
