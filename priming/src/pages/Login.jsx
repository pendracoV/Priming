import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo_electronico: "", contrasena: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);
            login(res.data.token, res.data);
            navigate("/asignar-acompanante");
        } catch (error) {
            alert("Error en el inicio de sesión");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="correo_electronico" placeholder="Correo" onChange={handleChange} required />
            <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
