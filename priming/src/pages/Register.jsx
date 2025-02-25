// Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    GlobalStyle,
    Container,
    FormContainer,
    Container2,
    Input,
    Select,
    Button,
    H1,
    Label,
    A
} from '../styles/styles';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        tipo: 'Estudiante',
        correo_electronico: '',
        contrasena: '',
        tipo_usuario: 'evaluador'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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
        <>
            <GlobalStyle />
            <Container>
                <FormContainer>
                    <Container2>
                        <H1>REGISTRO PRIMING</H1>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />

                            <Select name="tipo" value={formData.tipo} onChange={handleChange}>
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
                                <option value="Egresado">Egresado</option>
                            </Select>

                            <Input
                                type="text"
                                name="codigo"
                                placeholder="Código"
                                value={formData.codigo}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                type="email"
                                name="correo_electronico"
                                placeholder="Correo Electrónico"
                                value={formData.correo_electronico}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                type="password"
                                name="contrasena"
                                placeholder="Contraseña"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                            />

                            <Button type="submit">Registrarse</Button>
                        </form>
                        <Label>¿Ya tienes una cuenta? <A href="/login">INICIA SESION AQUI</A></Label>
                    </Container2>
                </FormContainer>
            </Container>
        </>
    );
};

export default Register;