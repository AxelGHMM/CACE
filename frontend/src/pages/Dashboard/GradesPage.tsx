import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  List,
  ListItemButton,
} from "@mui/material";
import DashboardLayout from "../Layout/DashboardLayout";

interface Calificacion {
  matricula: string;
  nombre: string;
  primerParcial: number;
  medioTermino: number;
  segundoParcial: number;
  examenGlobal: number;
  pia: number;
}

const GradesPage: React.FC = () => {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);

  const grupos = ["Grupo A", "Grupo B", "Grupo C"];

  const handleGrupoClick = (grupo: string) => {
    setGrupoSeleccionado(grupo);
    setCalificaciones([
      { matricula: "001", nombre: "Juan Pérez", primerParcial: 80, medioTermino: 85, segundoParcial: 90, examenGlobal: 95, pia: 92 },
      { matricula: "002", nombre: "María López", primerParcial: 75, medioTermino: 80, segundoParcial: 85, examenGlobal: 88, pia: 90 },
    ]);
  };

  const handleRegresar = () => {
    setGrupoSeleccionado(null);
    setCalificaciones([]);
  };

  const handleGuardar = () => {
    alert("Calificaciones guardadas correctamente.");
  };

  return (
    <DashboardLayout>
      <Box sx={{ bgcolor: "#1E1E1E", color: "white", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Calificaciones
        </Typography>
        {!grupoSeleccionado ? (
          <Grid container spacing={2} justifyContent="center">
            <Typography variant="h5" align="center" gutterBottom>
              Selecciona un Grupo
            </Typography>
            {grupos.map((grupo) => (
              <Grid item key={grupo}>
                <Button
                  variant="contained"
                  onClick={() => handleGrupoClick(grupo)}
                  sx={{ backgroundColor: "#37007d", "&:hover": { backgroundColor: "#4b0082" } }}
                >
                  {grupo}
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              Calificaciones del {grupoSeleccionado}
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e", mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>Matrícula</TableCell>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>Nombre</TableCell>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>Primer Parcial</TableCell>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>Medio Término</TableCell>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>Segundo Parcial</TableCell>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>Examen Global</TableCell>
                    <TableCell sx={{ color: "#fff", backgroundColor: "#37007d" }}>PIA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calificaciones.map((calificacion) => (
                    <TableRow key={calificacion.matricula}>
                      <TableCell>{calificacion.matricula}</TableCell>
                      <TableCell>{calificacion.nombre}</TableCell>
                      <TableCell>{calificacion.primerParcial}</TableCell>
                      <TableCell>{calificacion.medioTermino}</TableCell>
                      <TableCell>{calificacion.segundoParcial}</TableCell>
                      <TableCell>{calificacion.examenGlobal}</TableCell>
                      <TableCell>{calificacion.pia}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Button variant="contained" onClick={handleRegresar} sx={{ backgroundColor: "#4b0082" }}>
                  Regresar
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleGuardar} sx={{ backgroundColor: "#4caf50" }}>
                  Guardar Calificaciones
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default GradesPage;
