// src/pages/AdminUserCreate.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api/config';
import { useNavigate } from 'react-router-dom';

// Contenedor principal de la vista
const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

// Título de la página
const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

// Estilos para el formulario
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// Etiqueta para cada campo
const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

// Input de formulario
const Input = styled.input`
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Select para tipo de usuario
const Select = styled.select`
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Botón de envío
const Button = styled.button`
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

// Mensaje de error
const ErrorText = styled.p`
  color: red;
  margin-bottom: 15px;
`;

function AdminUserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    correo_electronico: '',
    contrasena: '',
    tipo_usuario: 'Usuario', // valor por defecto
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Actualiza el estado del formulario
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envía los datos al backend
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // POST /api/users
      const res = await api.post('/users', form);
      setSuccess('Usuario creado con ID: ' + res.data.id);
      // Opcional: redirigir a lista de usuarios
      // navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    }
  };

  return (
    <Container>
      <Title>Crear Nuevo Usuario</Title>
      {error && <ErrorText>{error}</ErrorText>}
      {success && <p>{success}</p>}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <Label htmlFor="correo_electronico">Correo Electrónico</Label>
        <Input
          id="correo_electronico"
          name="correo_electronico"
          type="email"
          value={form.correo_electronico}
          onChange={handleChange}
          required
        />

        <Label htmlFor="contrasena">Contraseña</Label>
        <Input
          id="contrasena"
          name="contrasena"
          type="password"
          value={form.contrasena}
          onChange={handleChange}
          required
        />

        <Label htmlFor="tipo_usuario">Tipo de Usuario</Label>
        <Select
          id="tipo_usuario"
          name="tipo_usuario"
          value={form.tipo_usuario}
          onChange={handleChange}
        >
          <option value="Usuario">Usuario</option>
          <option value="evaluador">Evaluador</option>
          <option value="administrador">Administrador</option>
        </Select>

        <Button type="submit">Crear Usuario</Button>
      </Form>
    </Container>
  );
}

export default AdminUserCreate;
