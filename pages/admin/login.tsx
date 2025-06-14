import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post<{ token: string }>('/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      router.push('/admin');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-md mx-auto">
        <h1 className="text-xl font-bold text-center mb-6">Login Municipal</h1>

        {error && (
          <p className="bg-red-100 text-red-700 rounded-md p-2 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
            />
          </div>

          <div className="pt-6">
            <button
              onClick={handleLogin}
              className="w-full bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
