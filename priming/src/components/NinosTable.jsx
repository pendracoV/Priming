import React from 'react';
import styled from 'styled-components';
import { Button } from '../styles/styles';

// Estilos para la tabla
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background: rgba(106, 106, 106, 0.7);
  color: #f4f4f4;
  padding: 12px;
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid #fc7500;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(106, 106, 106, 0.3);
  }
  &:hover {
    background-color: rgba(252, 117, 0, 0.2);
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  color: #f4f4f4;
`;

export const ActionButton = styled(Button)`
  width: auto;
  padding: 8px 16px;
  background-color: ${props => props.continuar ? '#28a745' : '#fc7500'};
  &:hover {
    background-color: ${props => props.continuar ? '#218838' : '#e56700'};
  }
`;

// Componente de tabla reutilizable
const NinosTable = ({ 
  ninos, 
  onIniciarJuego, 
  onContinuarJuego,
  columns = ['nombre', 'edad', 'grado', 'colegio', 'jornada', 'acciones']
}) => {
  // Función para determinar el grado formateado
  const determinarGrado = (grado) => {
    if (grado === 0 || grado === "-1" || grado === -1) return 'Preescolar';
    if (grado === 1 || grado === "1") return '1°';
    if (grado === 2 || grado === "2") return '2°';
    if (grado === 3 || grado === "3") return '3°';
    return `${grado}°`;
  };

  // Mapeo de nombres de columnas a títulos más legibles
  const columnTitles = {
    nombre: 'Nombre',
    edad: 'Edad',
    grado: 'Grado',
    colegio: 'Colegio',
    jornada: 'Jornada',
    acciones: 'Acciones'
  };

  return (
    <Table>
      <thead>
        <tr>
          {columns.map(column => (
            <TableHeader key={column}>{columnTitles[column]}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {ninos.map((nino, index) => {
          // Extraemos el nombre y el ID independientemente de la estructura de datos
          const nombre = nino.nombre || nino.nino_nombre || "Nombre no disponible";
          const id = nino.id || nino.nino_id || `nino-${index}`;
          
          return (
            <TableRow key={id}>
              {columns.includes('nombre') && <TableCell>{nombre}</TableCell>}
              {columns.includes('edad') && <TableCell>{nino.edad} años</TableCell>}
              {columns.includes('grado') && <TableCell>{determinarGrado(nino.grado)}</TableCell>}
              {columns.includes('colegio') && <TableCell>{nino.colegio}</TableCell>}
              {columns.includes('jornada') && <TableCell>{nino.jornada}</TableCell>}
              {columns.includes('acciones') && (
                <TableCell>
                  {nino.tiene_juego ? (
                    <ActionButton 
                      continuar 
                      onClick={() => onContinuarJuego(id)}
                    >
                      Continuar juego
                    </ActionButton>
                  ) : (
                    <ActionButton 
                      onClick={() => onIniciarJuego(id)}
                    >
                      Iniciar juego
                    </ActionButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
};

export default NinosTable;