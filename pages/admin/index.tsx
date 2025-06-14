// pages/admin/index.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [autorizado, setAutorizado] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/admin/login');
    } else {
      setAutorizado(true);
    }
  }, []);

  if (!autorizado) {
    return (
      <p style={{ textAlign: 'center', marginTop: '3rem' }}>
        Verificando sesión...
      </p>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel Municipal</h1>
      <p>Bienvenido al dashboard del municipio.</p>
    </div>
  );
}
