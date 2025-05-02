import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import evaluadorService from "../api/evaluadorService";
import {
  GlobalStyle,
  Button,
  H1,
} from '../styles/styles';

// Importando componentes reutilizables
import NinosTable from "../components/NinosTable";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import PageLayout, { ErrorMessage } from "../components/PageLayout";

const NinosListPage = () => {
  const { user } = useContext(AuthContext);
  const [ninos, setNinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNinos = async () => {
      try {
        setLoading(true);
        // Usamos el token almacenado directamente
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No hay token disponible");
        }
        
        const response = await evaluadorService.getNinosAsignados();
        
        // Procesamiento de datos
        let ninosData = [];
        
        if (Array.isArray(response)) {
          ninosData = response;
        } else if (response && Array.isArray(response.data)) {
          ninosData = response.data;
        } else if (response && response.success && Array.isArray(response.data)) {
          ninosData = response.data;
        }
        
        // Normalización de datos
        ninosData = ninosData.map(nino => {
          if (!nino.nombre && nino.nino_nombre) {
            return { ...nino, nombre: nino.nino_nombre };
          }
          return nino;
        });
        
        setNinos(ninosData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener niños:", err);
        setError("No se pudo cargar la lista de niños. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
        
        // Datos de ejemplo en caso de error (solo para desarrollo)
        if (process.env.NODE_ENV === 'development') {
          setNinos([
            { id: 1, nombre: "Ana García", edad: 6, grado: 1, colegio: "Colegio San José", jornada: "mañana", tiene_juego: false },
            { id: 2, nombre: "Pedro López", edad: 7, grado: 2, colegio: "Colegio Santa María", jornada: "tarde", tiene_juego: true },
          ]);
        }
      }
    };

    fetchNinos();
  }, []);

  const handleIniciarJuego = (ninoId) => {
    navigate(`/seleccion-mundo?ninoId=${ninoId}`);
  };

  const handleContinuarJuego = (ninoId) => {
    navigate(`/seleccion-mundos?ninoId=${ninoId}&continuar=true`);
  };

  const handleAsignarNino = () => {
    navigate('/asignar-nino');
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    } 
    
    if (error) {
      return <ErrorMessage 
              message={error} 
              onRetry={() => window.location.reload()} 
             />;
    } 
    
    if (ninos.length === 0) {
      return <EmptyState 
              message="No tienes niños asignados actualmente." 
              buttonText="Asignar Niño"
              onButtonClick={handleAsignarNino}
             />;
    } 
    
    return (
      <>
        <NinosTable 
          ninos={ninos} 
          onIniciarJuego={handleIniciarJuego}
          onContinuarJuego={handleContinuarJuego}
        />
        <Button 
          style={{ marginTop: '20px' }} 
          onClick={handleAsignarNino}
        >
          Asignar Nuevo Niño
        </Button>
      </>
    );
  };

  return (
    <>
      <GlobalStyle />
      <Navbar />
      
      <PageLayout 
        title={<H1>Lista de Niños Asignados</H1>}
        // Activar hasOverflow solo si hay muchos niños en la tabla
        hasOverflow={ninos.length > 10}
      >
        {renderContent()}
      </PageLayout>
    </>
  );
};

export default NinosListPage;