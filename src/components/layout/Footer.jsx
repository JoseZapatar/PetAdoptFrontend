import { Link } from "react-router-dom";
import { Heart, Mail, MapPin, PawPrint } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
            <span className="rounded-xl bg-purple-600 p-2 text-white">
              <Heart size={18} fill="currentColor" />
            </span>
            <span>PetAdopt</span>
          </Link>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            Plataforma para conectar mascotas que necesitan un hogar con personas dispuestas a adoptar de forma responsable.
          </p>

          <div className="mt-5 space-y-2 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <MapPin size={16} /> Nicaragua
            </p>
            <p className="flex items-center gap-2">
              <Mail size={16} /> contacto@petadopt.com
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900">Navegación</h3>
          <div className="mt-4 grid gap-3 text-sm text-gray-500">
            <Link to="/pets" className="hover:text-purple-600">Mascotas</Link>
            <Link to="/login" className="hover:text-purple-600">Iniciar sesión</Link>
            <Link to="/register" className="hover:text-purple-600">Registrarse</Link>
            <Link to="/profile" className="hover:text-purple-600">Mi perfil</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900">Adopción responsable</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <p className="flex gap-2">
              <PawPrint size={16} className="mt-0.5 shrink-0 text-purple-600" />
              Revisa bien la información de la mascota antes de enviar una solicitud.
            </p>
            <p className="flex gap-2">
              <PawPrint size={16} className="mt-0.5 shrink-0 text-purple-600" />
              Publica datos claros si quieres dar una mascota en adopción.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} PetAdopt. Todos los derechos reservados.
      </div>
    </footer>
  );
}
