import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AsignarEvaluador = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [evaluador, setEvaluador] = useState({
        nombre: "",
        tipo_documento: "CC",
        codigo: "",
        tipo: "Estudiante",
    });

    // Verificar si el usuario está autenticado
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Manejar cambio en los campos del formulario
    const handleChange = (e) => {
        setEvaluador({ ...evaluador, [e.target.name]: e.target.value });
    };

    // Enviar la asignación del acompañante al backend
    const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // ✅ Obtener el token almacenado

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
            nino_id: user?.id,  
            usuario_id: user?.id, 
            nombre: evaluador.nombre,
            tipo_documento: evaluador.tipo_documento,
            codigo: evaluador.codigo,
            tipo: evaluador.tipo
        };

        console.log("📩 Datos enviados al backend:", datosEnviados);


        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/asignar-evaluador`, datosEnviados, {
                headers: { Authorization: token }  // ✅ Se envía el token en la cabecera
            });

            alert(res.data.message || "✅ Acompañante asignado correctamente");
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
                    value={evaluador.nombre} 
                    onChange={handleChange} 
                    required 
                />

                <label>Tipo de Documento:</label>
                <select name="tipo_documento" value={evaluador.tipo_documento} onChange={handleChange} required>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Codigo de estudiante</option>
                    <option value="CEG">Codigo de egresado</option>
                </select>

                <label>Número de Documento:</label>
                <input 
                    type="text" 
                    name="codigo" 
                    placeholder="Ingrese el código" 
                    value={evaluador.codigo} 
                    onChange={handleChange} 
                    required 
                />

                <label>Tipo de Acompañante:</label>
                <select name="tipo" value={evaluador.tipo} onChange={handleChange} required>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                    <option value="Egresado">Egresado</option>
                </select>

                <button type="submit">Asignar Acompañante</button>
            </form>

            <button onClick={logout}>Cerrar Sesión</button>
        </div>
    );
};

export default AsignarEvaluador;
