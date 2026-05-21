
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


// Admin pages
import AdminDashboard     from "../pages/admin/AdminDashboard";
import InventoryPage      from "../pages/admin/InventoryPage";
import SuppliersPage      from "../pages/admin/SuppliersPage";
import PurchaseOrdersPage from "../pages/admin/PurchaseOrdersPage";
import AiInsightsPage     from "../pages/admin/AiInsightsPage";
import RiskScorerPage      from "../pages/admin/RiskScorerPage";
import ForecastingPage       from "../pages/admin/ForecastingPage"  
import UsersPage          from "../pages/admin/UsersPage";
import SettingsPage       from "../pages/admin/SettingsPage";

// Manager pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerInventory from "../pages/manager/ManagerInventory";
import ManagerPOPage    from "../pages/manager/ManagerPOPage";
import ManagerSuppliers from "../components/manager/ManagerSuppliers";
import ViewerDashboard from "../pages/ViewerDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* ADMIN */}
      <Route path="/admin/dashboard"      element={<ProtectedRoute allowedRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/inventory"      element={<ProtectedRoute allowedRole="ROLE_ADMIN"><InventoryPage /></ProtectedRoute>} />
      <Route path="/admin/suppliers"      element={<ProtectedRoute allowedRole="ROLE_ADMIN"><SuppliersPage /></ProtectedRoute>} />
      <Route path="/admin/purchase-orders" element={<ProtectedRoute allowedRole="ROLE_ADMIN"><PurchaseOrdersPage /></ProtectedRoute>} />
      <Route path="/admin/ai-insights" element={<ProtectedRoute allowedRole="ROLE_ADMIN"><AiInsightsPage /></ProtectedRoute>} />
      <Route path="/admin/risk-scorer" element={<ProtectedRoute allowedRole="ROLE_ADMIN"><RiskScorerPage /></ProtectedRoute>} />
      <Route path="/admin/forecasting" element={<ProtectedRoute allowedRole="ROLE_ADMIN"><ForecastingPage /></ProtectedRoute>} />
      <Route path="/admin/users"          element={<ProtectedRoute allowedRole="ROLE_ADMIN"><UsersPage /></ProtectedRoute>} />
      <Route path="/admin/settings"       element={<ProtectedRoute allowedRole="ROLE_ADMIN"><SettingsPage /></ProtectedRoute>} />

      {/* MANAGER */}
      <Route path="/manager/dashboard" element={<ProtectedRoute allowedRole="ROLE_INVENTORY_MANAGER"><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/inventory" element={<ProtectedRoute allowedRole="ROLE_INVENTORY_MANAGER"><ManagerInventory /></ProtectedRoute>} />
      <Route path="/manager/orders"    element={<ProtectedRoute allowedRole="ROLE_INVENTORY_MANAGER"><ManagerPOPage /></ProtectedRoute>} />
      <Route path="/manager/suppliers" element={<ProtectedRoute allowedRole="ROLE_INVENTORY_MANAGER"><ManagerSuppliers /></ProtectedRoute>} />

      {/* VIEWER */}
      <Route path="/viewer/dashboard" element={<ProtectedRoute allowedRole="ROLE_VIEWER"><ViewerDashboard /></ProtectedRoute>} />
    </Routes>
  );
}