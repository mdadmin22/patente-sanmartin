// pages/admin/index.tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminInicio() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [rolUsuario, setRolUsuario] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || !payload.rol || payload.rol !== 'admin') {
        router.push('/admin/login');
        return;
      }

      setRolUsuario(payload.rol); // ✅ correcto lugar
      setAutorizado(true);
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  if (!autorizado) return <p>Verificando acceso...</p>;

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Panel Administrativo</h1>
          <p className="text-sm text-white">Sesión iniciada como: <strong>{rolUsuario}</strong></p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/admin/login');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-xl mx-auto text-center">
        <h1 className="text-xl font-bold mb-6">Panel Municipal</h1>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/admin/tramites')}
            className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            📋 Ver listado de trámites
          </button>

          <button
            onClick={() => router.push('/admin/tramites-pendientes')}
            className="w-full bg-yellow-200 text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
          📥 Ver trámites pendientes
         </button>

          <button
            onClick={() => router.push('/admin/usuarios')}
            className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            👥 Listado de Operadores
          </button>

          <button
            onClick={() => router.push('/alta?origen=municipio')}
            className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            ➕ Alta presencial
          </button>

          <button
            onClick={() => router.push('/transferencia?origen=municipio')}
            className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            🔁 Transferencia presencial
          </button>

          <button
            onClick={() => router.push('/baja?origen=municipio')}
            className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            🔻 Baja presencial
          </button>
        </div>
      </div>
    </div>
  );
}
