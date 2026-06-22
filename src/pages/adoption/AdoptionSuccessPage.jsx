import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

export default function AdoptionSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-4xl">
            ✓
          </div>

          <h1 className="mt-6 text-4xl font-bold text-gray-900">
            ¡Solicitud enviada!
          </h1>

          <p className="mt-4 text-gray-600">
            Hemos recibido tu solicitud de adopción correctamente.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Volver al catálogo
          </Link>
        </div>
      </main>
    </div>
  );
}