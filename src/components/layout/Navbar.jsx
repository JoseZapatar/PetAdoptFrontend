import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

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

function Dropdown({ label, children }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-xl px-3 py-2 font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        {label}
        <span className="text-xs">▾</span>
      </button>

      <div className="invisible absolute left-0 top-full z-50 min-w-56 rounded-2xl border bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}

function DropdownLink({ to, children }) {
  return (
    <Link
      to={to}
      className="block rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin = isAdminUser(user);
  const isAdopter = isAdopterUser(user);
  const isPublisher = isPublisherUser(user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-gray-900">
          <span className="rounded-xl bg-purple-600 p-2 text-white">
            <Heart size={18} fill="currentColor" />
          </span>

          <span>PetAdopt</span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-3 text-sm md:flex">
          <Link
            to="/pets"
            className="rounded-xl px-3 py-2 font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
          >
            Mascotas
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Dropdown label="Administración">
                  <DropdownLink to="/admin/dashboard">Dashboard</DropdownLink>
                  <DropdownLink to="/admin/ManageRequests">Solicitudes</DropdownLink>
                  <DropdownLink to="/admin/ManagePets">Mascotas</DropdownLink>
                  <DropdownLink to="/admin/users-roles">Usuarios y roles</DropdownLink>
                  <DropdownLink to="/admin/species">Especies</DropdownLink>
                  <DropdownLink to="/admin/breeds">Razas</DropdownLink>
                  <DropdownLink to="/admin/recommendations">Recomendaciones</DropdownLink>
                </Dropdown>
              )}

              {isAdopter && (
                <Dropdown label="Adopciones">
                  <DropdownLink to="/my-requests">Mis solicitudes</DropdownLink>
                  <DropdownLink to="/adoption-history">Historial</DropdownLink>
                </Dropdown>
              )}

              {isPublisher && (
                <Dropdown label="Publicador">
                  <DropdownLink to="/publisher/pets">Mis mascotas</DropdownLink>
                  <DropdownLink to="/publisher/pets/new">Publicar mascota</DropdownLink>
                  <DropdownLink to="/publisher/requests">Solicitudes recibidas</DropdownLink>
                  <DropdownLink to="/publisher/history">Historial</DropdownLink>
                </Dropdown>
              )}

              <Dropdown label="Cuenta">
                <DropdownLink to="/profile">Mi perfil</DropdownLink>
                <DropdownLink to="/recommendations">Enviar recomendación</DropdownLink>
              </Dropdown>

              <span className="max-w-48 truncate font-semibold text-gray-800" title={user.name}>
                Hola, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/recommendations"
                className="rounded-xl px-3 py-2 font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                Recomendaciones
              </Link>

              <Link
                to="/login"
                className="rounded-xl px-3 py-2 font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
