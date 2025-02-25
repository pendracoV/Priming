import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Form, useNavigate } from "react-router-dom";
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
            login(res.data.token, res.data.user);
            navigate("/asignar-acompanante");
        } catch (error) {
            alert("Error en el inicio de sesión");
        }
    };

    return (
        <>
        <GlobalStyle />
        <Container>
            <FormContainer>
                <Container2>
                    <H1>PRIMING</H1>
                    <form onSubmit={handleSubmit}>
                        <Input type="email" name="correo_electronico" placeholder="Correo" onChange={handleChange} required />
                        <Input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
                        <Button type="submit">Iniciar Sesión</Button>
                    </form>
                    <Label>¿No tienes una cuenta? <A href="/register">REGISTRATE</A></Label>
                </Container2>
            </FormContainer>
        </Container>

        </>
    );
};

export default Login;
