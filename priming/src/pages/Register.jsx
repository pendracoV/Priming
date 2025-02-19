import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        edad: '5',
        grado: '0',
        colegio: '',
        jornada: 'mañana',
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

        
    
        if (!formData.contrasena.trim()) {
            alert("La contraseña es obligatoria");
            return;
        }
        if (!formData.nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }
        if (!formData.colegio.trim()) {
            alert("El colegio es obligatorio");
            return;
        }
        if (!formData.correo_electronico.trim()) {
            alert("El correo electrónico es obligatorio");
            return;
        }
    
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, formData);
            alert(res.data.message);
            navigate("/login"); 
        } catch (error) {
            console.error("Error en el registro:", error);
            alert(error.response?.data?.error || 'Error en el registro');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
            />

            <label>Edad: </label>
            <select name="edad" value={formData.edad} onChange={handleChange}>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
            </select>

            <label>Grado: </label>
            <select name="grado" value={formData.grado} onChange={handleChange}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>

            <input 
                type="text" 
                name="colegio" 
                placeholder="Colegio" 
                value={formData.colegio} 
                onChange={handleChange} 
                required 
            />

            <label>Jornada: </label>
            <select name="jornada" value={formData.jornada} onChange={handleChange}>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
            </select>

            <input 
                type="email" 
                name="correo_electronico" 
                placeholder="Correo Electrónico" 
                value={formData.correo_electronico} 
                onChange={handleChange} 
                required 
            />

            <input 
                type="password" 
                name="contrasena" 
                placeholder="Contraseña" 
                value={formData.contrasena} 
                onChange={handleChange} 
                required 
            />

            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;
