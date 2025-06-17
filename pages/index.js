//pages/index.js
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white flex flex-col items-center pt-10 px-4">
      {/* Logo */}
      <div className="mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      {/* Contenedor central */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-6">Registro de Patentes Municipales</h1>

        {/* Botones con efecto */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/alta"
            className="bg-white text-[#5b2b8c] font-bold py-4 px-6 rounded-lg shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            ALTA
          </Link>

          <Link
            href="/transferencia"
            className="bg-white text-[#5b2b8c] font-bold py-4 px-6 rounded-lg shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            TRASNSF.
          </Link>

          <Link
            href="/baja"
            className="bg-white text-[#5b2b8c] font-bold py-4 px-6 rounded-lg shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            BAJA
          </Link>
        </div>
      </div>
    </div>
  );
}
