import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        codigo:'',
        tipo:'',
        correo_electronico: '',
        contrasena: '',
        tipo_usuario: 'evaluador'
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

            <label>Tipo: </label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="Psicologo">Psiscologo</option>
                <option value="Pasante">Pasante</option>
                <option value="Adulto">Adulto</option>
            </select>


            <input 
                type="text" 
                name="codigo" 
                placeholder="codigo" 
                value={formData.codigo} 
                onChange={handleChange} 
                required 
            />


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
