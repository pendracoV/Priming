import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AsignarEvaluador = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [nino, setNino] = useState({
    nombre: "",
    correo_electronico: "",
    tipo_usuario: "niño", // Se utiliza internamente para el registro
    contrasena: "",
    edad: "",
    grado: "",
    colegio: "",
    jornada: "",
  });
  
  const [listaNinos, setListaNinos] = useState([]);

  // Cargar la lista de niños asignados al evaluador cuando se cargue el componente
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchAssignedNinos();
    }
  }, [user, navigate]);

  // Función para obtener los niños asignados al evaluador
  const fetchAssignedNinos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/evaluador/ninos`,
        { headers: { Authorization: token } }
      );
      setListaNinos(response.data);
    } catch (error) {
      console.error("Error obteniendo niños asignados:", error);
    }
  };

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setNino({ ...nino, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("❌ No hay sesión activa. Por favor, inicia sesión.");
      navigate("/login");
      return;
    }

    if (!user?.id) {
      alert("❌ No se pudo obtener el ID del usuario. Vuelve a iniciar sesión.");
      navigate("/login");
      return;
    }

    const datosEnviados = {
      nombre: nino.nombre,
      correo_electronico: nino.correo_electronico,
      contrasena: nino.contrasena,
      edad: parseInt(nino.edad),
      grado: parseInt(nino.grado),
      colegio: nino.colegio,
      jornada: nino.jornada,
    };

    console.log("📩 Datos enviados al backend:", datosEnviados);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/asignar-evaluador`,
        datosEnviados,
        { headers: { Authorization: token } }
      );

      alert(res.data.message || "✅ Acompañante asignado correctamente");
      
      // Actualizamos la lista de niños asignados tras el registro exitoso
      fetchAssignedNinos();

      // Reiniciamos el formulario (opcional)
      setNino({
        nombre: "",
        correo_electronico: "",
        tipo_usuario: "niño",
        contrasena: "",
        edad: "",
        grado: "",
        colegio: "",
        jornada: "",
      });
    } catch (error) {
      console.error("❌ Error asignando acompañante:", error);
      alert(error.response?.data?.error || "Error al asignar acompañante");
    }
  };

  return (
    <div>
      <h2>Asignar Acompañante</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Ingrese el nombre"
          value={nino.nombre}
          onChange={handleChange}
          required
        />

        <label>Edad: </label>
        <select name="edad" value={nino.edad} onChange={handleChange} required>
          <option value="">Seleccione edad</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>

        <label>Grado: </label>
        <select name="grado" value={nino.grado} onChange={handleChange} required>
          <option value="">Seleccione grado</option>
          <option value="0">Prescolar</option>
          <option value="1">Primero</option>
          <option value="2">Segundo</option>
        </select>

        <label>Jornada: </label>
        <select name="jornada" value={nino.jornada} onChange={handleChange} required>
          <option value="">Seleccione jornada</option>
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="Continua">Continua</option>
        </select>

        <label>Colegio: </label>
        <input
          type="text"
          name="colegio"
          placeholder="Ingrese el nombre del Colegio"
          value={nino.colegio}
          onChange={handleChange}
          required
        />

        <label>Correo: </label>
        <input
          type="email"
          name="correo_electronico"
          placeholder="Ingrese el correo electrónico"
          value={nino.correo_electronico}
          onChange={handleChange}
          required
        />

        <label>Contraseña: </label>
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={nino.contrasena}
          onChange={handleChange}
          required
        />

        <button type="submit">Asignar Acompañante</button>
      </form>

      <h3>Niños asignados</h3>
      {listaNinos.length === 0 ? (
        <p>No hay niños asignados.</p>
      ) : (
        <ul>
          {listaNinos.map((item) => (
            <li key={item.encuesta_id}>
              {item.nino_nombre} ({item.nino_correo}) - Edad: {item.edad}, Grado: {item.grado}, Colegio: {item.colegio}, Jornada: {item.jornada}
            </li>
          ))}
        </ul>
      )}

      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default AsignarEvaluador;
