import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PetsPage from "../pages/catalog/PetsPage";
import PetDetailPage from "../pages/catalog/PetDetailPage";
import AdoptionFormPage from "../pages/adoption/AdoptionFormPage";
import AdoptionSuccessPage from "../pages/adoption/AdoptionSuccessPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MyRequestsPage from "../pages/adoption/MyRequestsPage";
import ManageRequests from "../pages/admin/ManageRequests";
import ManagePets from "../pages/admin/ManagePets";
import PetFormPage from "../pages/admin/PetFormPage";
import PetImagesPage from "../pages/admin/PetImagesPage";
import { useAuthStore } from "../store/authStore";
import AdminDashboard from "../pages/admin/AdminDashboard";

function isAdminUser(user) {
  return user?.roleName === "Administrador" || user?.roleName === "admin";
}

function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdminUser(user)) return <Navigate to="/pets" replace />;

  return children;
}

function AdopterRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (isAdminUser(user)) return <Navigate to="/admin/dashboard" replace />;

  return children;
}

function PublicAdopterOnly({ children }) {
  const user = useAuthStore((state) => state.user);

  if (isAdminUser(user)) return <Navigate to="/admin/dashboard" replace />;

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicAdopterOnly>
              <PetsPage />
            </PublicAdopterOnly>
          }
        />

        <Route
          path="/pets"
          element={
            <PublicAdopterOnly>
              <PetsPage />
            </PublicAdopterOnly>
          }
        />

        <Route
          path="/pets/:id"
          element={
            <PublicAdopterOnly>
              <PetDetailPage />
            </PublicAdopterOnly>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/adopt/:petId"
          element={
            <AdopterRoute>
              <AdoptionFormPage />
            </AdopterRoute>
          }
        />

        <Route
          path="/success"
          element={
            <AdopterRoute>
              <AdoptionSuccessPage />
            </AdopterRoute>
          }
        />

        <Route
          path="/my-requests"
          element={
            <AdopterRoute>
              <MyRequestsPage />
            </AdopterRoute>
          }
        />

        <Route
          path="/admin/ManageRequests"
          element={
            <AdminRoute>
              <ManageRequests />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ManagePets"
          element={
            <AdminRoute>
              <ManagePets />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/pets/create"
          element={
            <AdminRoute>
              <PetFormPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/pets/edit/:id"
          element={
            <AdminRoute>
              <PetFormPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/pets/:petId/images"
          element={
            <AdminRoute>
              <PetImagesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );  
}