import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin =
    user?.roleName === "Administrador" ||
    user?.roleName === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-gray-900"
        >
          <span className="rounded-xl bg-purple-600 p-2 text-white">
            <Heart size={18} fill="currentColor" />
          </span>

          <span>PetAdopt</span>
        </Link>

        {/* Menú */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link
            to="/pets"
            className="text-gray-600 hover:text-purple-600"
          >
            Mascotas
          </Link>

          {user ? (
            <>
              {/* Menú Administrador */}
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/ManageRequests"
                    className="font-semibold text-purple-600"
                  >
                    Solicitudes
                  </Link>

                  <Link
                    to="/admin/ManagePets"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Mascotas Admin
                  </Link>
                </>
              ) : (
                <>
                  {/* Menú Adoptante */}
                  <Link
                    to="/my-requests"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Mis solicitudes
                  </Link>
                </>
              )}

              <span className="font-semibold text-gray-800">
                Hola, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-purple-600"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700"
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