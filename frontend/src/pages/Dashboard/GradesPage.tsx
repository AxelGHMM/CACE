// src/pages/GradesPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
    // Aquí puedes cargar las calificaciones desde tu API
    setCalificaciones([
      {
        matricula: "001",
        nombre: "Juan Pérez",
        primerParcial: 80,
        medioTermino: 85,
        segundoParcial: 90,
        examenGlobal: 95,
        pia: 92,
      },
      {
        matricula: "002",
        nombre: "María López",
        primerParcial: 75,
        medioTermino: 80,
        segundoParcial: 85,
        examenGlobal: 88,
        pia: 90,
      },
    ]);
  };

  const handleRegresar = () => {
    setGrupoSeleccionado(null);
    setCalificaciones([]);
  };

  const handleGuardar = () => {
    alert("Calificaciones guardadas correctamente.");
    // Aquí podrías hacer una petición para guardar las calificaciones
  };

  return (
    <DashboardLayout>
      <Box sx={{ bgcolor: "#121212", minHeight: "100vh", color: "#fff", p: 3 }}>
        {!grupoSeleccionado ? (
          <Box>
            <Typography variant="h5" align="center" gutterBottom>
              Selecciona un Grupo
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {grupos.map((grupo) => (
                <Grid item key={grupo}>
                  <Button
                    variant="contained"
                    onClick={() => handleGrupoClick(grupo)}
                    sx={{
                      backgroundColor: "#37007d",
                      "&:hover": { backgroundColor: "#4b0082" },
                    }}
                  >
                    {grupo}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              Calificaciones del {grupoSeleccionado}
            </Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: "#1e1e1e" }}>
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
