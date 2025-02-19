import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";  
import Register from "./pages/Register";  
import AsignarAcompanante from "./pages/AsignarAcompanante";  

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/asignar-acompanante" element={<AsignarAcompanante />} />
                    <Route path="*" element={<Navigate to="/login" />} />  {/* Redirección si la ruta no existe */}
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);
