import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PetsPage from "../pages/catalog/PetsPage";
import PetDetailPage from "../pages/catalog/PetDetailPage";
import AdoptionFormPage from "../pages/adoption/AdoptionFormPage";
import AdoptionSuccessPage from "../pages/adoption/AdoptionSuccessPage";
import AdoptionHistoryPage from "../pages/adoption/AdoptionHistoryPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MyRequestsPage from "../pages/adoption/MyRequestsPage";
import ManageRequests from "../pages/admin/ManageRequests";
import ManagePets from "../pages/admin/ManagePets";
import PetFormPage from "../pages/admin/PetFormPage";
import PetImagesPage from "../pages/admin/PetImagesPage";
import { useAuthStore } from "../store/authStore";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsersRoles from "../pages/admin/ManageUsersRoles";
import PublisherPetsPage from "../pages/publisher/PublisherPetsPage";
import PublisherPetCreatePage from "../pages/publisher/PublisherPetCreatePage";
import PublisherRequestsPage from "../pages/publisher/PublisherRequestsPage";
import PublisherHistoryPage from "../pages/publisher/PublisherHistoryPage";
import ProfilePage from "../pages/profile/ProfilePage";
import AdminBreedsPage from "../pages/admin/AdminBreedsPage";
import AdminSpeciesPage from "../pages/admin/AdminSpeciesPage";
import AdminRecommendationsPage from "../pages/admin/AdminRecommendationsPage";
import SendRecommendationPage from "../pages/recommendations/SendRecommendationPage";

function getRoleName(user) {
  return user?.roleName?.toLowerCase();
}

function isAdminUser(user) {
  const role = getRoleName(user);
  return role === "admin" || role === "administrador";
}

function isAdopterUser(user) {
  const role = getRoleName(user);
  return role === "adopter" || role === "adoptante";
}

function isPublisherUser(user) {
  const role = getRoleName(user);
  return role === "publicador";
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
  if (!isAdopterUser(user)) return <Navigate to="/pets" replace />;

  return children;
}

function PublisherRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (isAdminUser(user)) return <Navigate to="/admin/dashboard" replace />;
  if (!isPublisherUser(user)) return <Navigate to="/pets" replace />;

  return children;
}

function AuthenticatedRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function PublicRoute({ children }) {
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
            <PublicRoute>
              <PetsPage />
            </PublicRoute>
          }
        />

        <Route
          path="/pets"
          element={
            <PublicRoute>
              <PetsPage />
            </PublicRoute>
          }
        />

        <Route
          path="/pets/:id"
          element={
            <PublicRoute>
              <PetDetailPage />
            </PublicRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <AuthenticatedRoute>
              <ProfilePage />
            </AuthenticatedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <AuthenticatedRoute>
              <SendRecommendationPage />
            </AuthenticatedRoute>
          }
        />

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
          path="/adoption-history"
          element={
            <AdopterRoute>
              <AdoptionHistoryPage />
            </AdopterRoute>
          }
        />

        <Route
          path="/publisher/pets"
          element={
            <PublisherRoute>
              <PublisherPetsPage />
            </PublisherRoute>
          }
        />

        <Route
          path="/publisher/pets/new"
          element={
            <PublisherRoute>
              <PublisherPetCreatePage />
            </PublisherRoute>
          }
        />

        <Route
          path="/publisher/requests"
          element={
            <PublisherRoute>
              <PublisherRequestsPage />
            </PublisherRoute>
          }
        />

        <Route
          path="/publisher/history"
          element={
            <PublisherRoute>
              <PublisherHistoryPage />
            </PublisherRoute>
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

        <Route
          path="/admin/users-roles"
          element={
            <AdminRoute>
              <ManageUsersRoles />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/breeds"
          element={
            <AdminRoute>
              <AdminBreedsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/species"
          element={
            <AdminRoute>
              <AdminSpeciesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/recommendations"
          element={
            <AdminRoute>
              <AdminRecommendationsPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
