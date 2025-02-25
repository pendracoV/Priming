import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  GlobalStyle,
  Input,
  Select,
  Button,
  H1,
  Label,
  A,
  LogoutButton
} from '../styles/styles';


export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh; 
    margin: 0;
    padding: 0;
    overflow: auto; 
    background: url('/images/image.png') no-repeat center center / cover;

`;
export const FormContainer = styled.div`
    background: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 550px;
    text-align: center;
    padding: 50px;
    margin: 20px; 
`;

export const Container2 = styled.div`
    background: rgba(255, 255, 255, 0.2);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

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
    <>
      <GlobalStyle />
      <Container>
        <FormContainer>
          <Container2>
      
    
      <H1>Asignar Acompañante</H1>

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="nombre"
          placeholder="Ingrese el nombre"
          value={nino.nombre}
          onChange={handleChange}
          required
        />

        
        <Select name="edad" value={nino.edad} onChange={handleChange} required>
          <option value="">Seleccione edad</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </Select>

        
        <Select name="grado" value={nino.grado} onChange={handleChange} required>
          <option value="">Seleccione grado</option>
          <option value="0">Prescolar</option>
          <option value="1">Primero</option>
          <option value="2">Segundo</option>
        </Select>

        
        <Select name="jornada" value={nino.jornada} onChange={handleChange} required>
          <option value="">Seleccione jornada</option>
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="Continua">Continua</option>
        </Select>

       
        <Input
          type="text"
          name="colegio"
          placeholder="Ingrese el nombre del Colegio"
          value={nino.colegio}
          onChange={handleChange}
          required
        />

       
        <Input
          type="email"
          name="correo_electronico"
          placeholder="Ingrese el correo electrónico"
          value={nino.correo_electronico}
          onChange={handleChange}
          required
        />

        
        <Input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={nino.contrasena}
          onChange={handleChange}
          required
        />

        <Button type="submit">Asignar Acompañante</Button>
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

      
    
        </Container2>
      </FormContainer>
      <LogoutButton onClick={logout}>Cerrar Sesión</LogoutButton>
    </Container>
    
    </>
  );
};

export default AsignarEvaluador;
