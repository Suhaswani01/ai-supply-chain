import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import InventoryPage from "../pages/admin/InventoryPage";
import SuppliersPage from "../pages/admin/SuppliersPage";
import PurchaseOrdersPage from "../pages/admin/PurchaseOrdersPage";
import UsersPage from "../pages/admin/UsersPage";
import SettingsPage from "../pages/admin/SettingsPage";
import ManagerDashboard from "../pages/ManagerDashboard";
import ViewerDashboard from "../pages/ViewerDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="ROLE_ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/inventory" element={
        <ProtectedRoute allowedRole="ROLE_ADMIN">
          <InventoryPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/suppliers" element={
        <ProtectedRoute allowedRole="ROLE_ADMIN">
          <SuppliersPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/purchase-orders" element={
        <ProtectedRoute allowedRole="ROLE_ADMIN">
          <PurchaseOrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRole="ROLE_ADMIN">
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRole="ROLE_ADMIN">
          <SettingsPage />
        </ProtectedRoute>
      } />

      <Route path="/manager/dashboard" element={
        <ProtectedRoute allowedRole="ROLE_INVENTORY_MANAGER">
          <ManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/viewer/dashboard" element={
        <ProtectedRoute allowedRole="ROLE_VIEWER">
          <ViewerDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}