// pages/admin/ver-estructura.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Columna {
  column_name: string;
  data_type: string;
}

export default function VerEstructuraBD() {
  const [estructura, setEstructura] = useState<Record<string, Columna[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios.get("/api/ver-estructura-bd")
    .then((res) => {
      const data = res.data as { estructura: Record<string, Columna[]> };
      setEstructura(data.estructura);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error al obtener estructura:", err);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Cargando estructura de la base de datos...</p>;

  const limpiarDatos = async () => {
  const confirmar = confirm("¿Estás seguro que querés eliminar todas las INSCRIPCIONES y CUOTAS? Esta acción no se puede deshacer.");
  if (!confirmar) return;

  try {
    const res = await fetch("/api/limpiar-tablas", { method: "POST" });
    const data = await res.json();
    if (data.exito) {
      alert("✅ Tablas limpiadas correctamente.");
      location.reload();
    } else {
      alert("❌ Error al limpiar: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error inesperado.");
  }
};


  return (
    <div style={{ padding: "2rem" }}>
        <button
  onClick={limpiarDatos}
  style={{
    marginBottom: "2rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }}
>
  🧹 Limpiar inscripciones y cuotas (solo testeo)
</button>

      <h1>Estructura de la Base de Datos</h1>
      {Object.entries(estructura).map(([tabla, columnas]) => (
        <div key={tabla} style={{ marginBottom: "2rem" }}>
          <h2>Tabla: <strong>{tabla}</strong></h2>
          <table border={1} cellPadding={8} cellSpacing={0}>
            <thead>
              <tr>
                <th>Columna</th>
                <th>Tipo de dato</th>
              </tr>
            </thead>
            <tbody>
              {columnas.map((col, idx) => (
                <tr key={idx}>
                  <td>{col.column_name}</td>
                  <td>{col.data_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
