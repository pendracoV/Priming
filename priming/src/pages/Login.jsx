import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        correo_electronico: '',
        contrasena: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);
            localStorage.setItem('token', res.data.token);
            alert('Inicio de sesión exitoso');
        } catch (error) {
            alert('Error en el inicio de sesión');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" onChange={handleChange} required />
            <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
