import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
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
  return getRoleName(user) === "publicador";
}

function DesktopDropdown({ label, links }) {
  if (!links.length) return null;

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-xl px-3 py-2 font-medium text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
      >
        {label}
        <ChevronDown size={16} />
      </button>

      <div className="invisible absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({ label, links, onNavigate }) {
  const [open, setOpen] = useState(true);

  if (!links.length) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 font-bold text-gray-900"
      >
        {label}
        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-1 px-2 pb-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className="block rounded-xl px-3 py-2.5 text-gray-600 transition hover:bg-white hover:text-purple-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin = isAdminUser(user);
  const isAdopter = isAdopterUser(user);
  const isPublisher = isPublisherUser(user);

  const menuGroups = useMemo(() => {
    const groups = [
      {
        label: "Catálogo",
        links: [{ to: "/pets", label: "Mascotas" }],
      },
    ];

    if (isAdmin) {
      groups.push({
        label: "Administración",
        links: [
          { to: "/admin/dashboard", label: "Dashboard" },
          { to: "/admin/ManageRequests", label: "Solicitudes" },
          { to: "/admin/ManagePets", label: "Mascotas" },
          { to: "/admin/users-roles", label: "Usuarios y roles" },
          { to: "/admin/species", label: "Especies" },
          { to: "/admin/breeds", label: "Razas" },
          { to: "/admin/recommendations", label: "Recomendaciones" },
        ],
      });
    }

    if (isAdopter) {
      groups.push({
        label: "Adopciones",
        links: [
          { to: "/my-requests", label: "Mis solicitudes" },
          { to: "/adoption-history", label: "Historial" },
        ],
      });
    }

    if (isPublisher) {
      groups.push({
        label: "Publicador",
        links: [
          { to: "/publisher/pets", label: "Mis mascotas" },
          { to: "/publisher/pets/new", label: "Publicar mascota" },
          { to: "/publisher/requests", label: "Solicitudes recibidas" },
          { to: "/publisher/history", label: "Historial" },
        ],
      });
    }

    if (user) {
      groups.push({
        label: "Cuenta",
        links: [
          { to: "/profile", label: "Mi perfil" },
          { to: "/recommendations", label: "Enviar recomendación" },
        ],
      });
    } else {
      groups.push({
        label: "Ayuda",
        links: [{ to: "/recommendations", label: "Recomendaciones" }],
      });
    }

    return groups;
  }, [isAdmin, isAdopter, isPublisher, user]);

  const closeMobileMenu = () => setIsMobileOpen(false);

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:py-4">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-2 font-bold text-gray-900"
        >
          <span className="shrink-0 rounded-xl bg-purple-600 p-2 text-white">
            <Heart size={18} fill="currentColor" />
          </span>
          <span className="truncate text-lg">PetAdopt</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {menuGroups.map((group) => (
            <DesktopDropdown
              key={group.label}
              label={group.label}
              links={group.links}
            />
          ))}
        </div>

        <div className="hidden min-w-0 items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="max-w-56 truncate text-sm font-semibold text-gray-800">
                Hola, {user.name}
              </span>

              <button
                type="button"
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
                className="rounded-xl px-4 py-2 font-semibold text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
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

        <button
          type="button"
          onClick={() => setIsMobileOpen((value) => !value)}
          className="rounded-xl border border-gray-200 p-2 text-gray-700 lg:hidden"
          aria-label="Abrir menú"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isMobileOpen && (
        <div className="border-t bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl space-y-3">
            {user && (
              <div className="rounded-2xl bg-purple-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                  Sesión activa
                </p>
                <p className="mt-1 break-words font-bold text-gray-900">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}

            {menuGroups.map((group) => (
              <MobileGroup
                key={group.label}
                label={group.label}
                links={group.links}
                onNavigate={closeMobileMenu}
              />
            ))}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-center font-semibold text-gray-700"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-purple-600 px-5 py-3 text-center font-semibold text-white"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
