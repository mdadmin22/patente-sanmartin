// pages/alta.js
import { useRouter } from "next/router";
import { useState } from "react";

export default function Alta() {
  const router = useRouter();

  const [tipoTramite, setTipoTramite] = useState("ALTA");
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [dniCuit, setDniCuit] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [domicilioCalle, setDomicilioCalle] = useState("");
  const [domicilioNro, setDomicilioNro] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mail, setMail] = useState("");
  const [mailRepetir, setMailRepetir] = useState("");
  const [provincia, setProvincia] = useState("Chaco");
  const [departamento, setDepartamento] = useState("Ldor. Gral. San Martín");
  const [localidad, setLocalidad] = useState("Gral. José de San Martín");

  const handleSiguiente = () => {
    const datosTitular = {
      tipo_tramite: tipoTramite,
      tipo_documento: tipoDocumento,
      dni_cuit: dniCuit,
      apellido,
      nombre,
      razon_social: razonSocial,
      domicilio_calle: domicilioCalle,
      domicilio_nro: domicilioNro,
      telefono,
      mail,
      mail_repetir: mailRepetir,
      provincia,
      departamento,
      localidad
    };

    sessionStorage.setItem("datosTitular", JSON.stringify(datosTitular));
    router.push({ pathname: "/consulta/origen" });
  };

  const handleVolver = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black pt-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Paso 1: Datos del Contribuyente</h1>

      <div className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-md shadow-md">
        <div>
          <label>Tipo de Documento:</label>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="DNI">DNI</option>
            <option value="CUIL">CUIL</option>
            <option value="CUIT">CUIT</option>
          </select>
        </div>

        <div>
          <label>DNI / CUIL / CUIT:</label>
          <input
            type="text"
            value={dniCuit}
            onChange={(e) => setDniCuit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {(tipoDocumento === "DNI" || tipoDocumento === "CUIL") && (
          <>
            <div>
              <label>Apellido:</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}

        {tipoDocumento === "CUIT" && (
          <div>
            <label>Razón Social:</label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        <div>
          <label>Provincia:</label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Departamento:</label>
          <input
            type="text"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Localidad:</label>
          <input
            type="text"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Domicilio - Calle:</label>
          <input
            type="text"
            value={domicilioCalle}
            onChange={(e) => setDomicilioCalle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Domicilio - Número:</label>
          <input
            type="text"
            value={domicilioNro}
            onChange={(e) => setDomicilioNro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Mail:</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Repetir Mail:</label>
          <input
            type="email"
            value={mailRepetir}
            onChange={(e) => setMailRepetir(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleVolver}
            className="bg-gray-400 text-white py-2 px-4 rounded-md"
          >
            Volver
          </button>
          <button
            onClick={handleSiguiente}
            className="bg-[#5b2b8c] text-white py-2 px-4 rounded-md"
          >
            Siguiente Paso
          </button>
        </div>
      </div>
    </div>
  );
}
