import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
            <span className="rounded-xl bg-purple-600 p-2 text-white">
              <Heart size={18} fill="currentColor" />
            </span>
            <span>PetAdopt</span>
          </Link>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            Plataforma para conectar mascotas en adopción con personas que pueden darles un hogar responsable.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-gray-900">Navegación</h3>
          <div className="mt-4 grid gap-2 text-sm text-gray-500">
            <Link to="/pets" className="hover:text-purple-600">Mascotas</Link>
            <Link to="/recommendations" className="hover:text-purple-600">Enviar recomendación</Link>
            <Link to="/login" className="hover:text-purple-600">Iniciar sesión</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900">Cuenta</h3>
          <div className="mt-4 grid gap-2 text-sm text-gray-500">
            <Link to="/register" className="hover:text-purple-600">Registrarse</Link>
            <Link to="/profile" className="hover:text-purple-600">Mi perfil</Link>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} PetAdopt. Todos los derechos reservados.
      </div>
    </footer>
  );
}
