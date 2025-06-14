// pages/admin/index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Image from 'next/image';

export default function AdminInicio() {
  const router = useRouter();

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
      }
    } catch {
      router.push('/admin/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
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
            onClick={() => router.push('/admin/crear-usuario')}
            className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
          >
            ➕ Crear nuevo usuario
          </button>
        </div>
      </div>
    </div>
  );
}
