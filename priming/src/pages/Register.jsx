import { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo_electronico: '',
        contrasena: '',
        tipo_usuario: 'niño'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('📩 Datos enviados al backend:', formData);
    
        if (!formData.contrasena || formData.contrasena.trim() === '') {
            alert("La contraseña es obligatoria");
            return;
        }
    
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
                nombre: formData.nombre,
                correo_electronico: formData.correo_electronico,
                contrasena: formData.contrasena, // Asegurar que se envía correctamente
                tipo_usuario: formData.tipo_usuario
            });
    
            alert(res.data.message);
        } catch (error) {
            console.error("Error en el registro:", error);
            alert('Error en el registro');
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" onChange={handleChange} required />
            <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;
