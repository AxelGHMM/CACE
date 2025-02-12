import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, CircularProgress, Button } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardLayout from "../Layout/DashboardLayout";
import api from "../../utils/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await api.get("/homepage");
        setUser(response.data.user);
      } catch (err) {
        console.error("Error al cargar el homepage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const barData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Asistencias",
        data: [100, 250, 400, 550, 300],
        backgroundColor: "#800080",
      },
    ],
  };

  const pieData = {
    labels: ["1 Grado", "2 Grado", "3 Grado"],
    datasets: [
      {
        data: [300, 500, 200],
        backgroundColor: ["#800080", "#9932CC", "#BA55D3"],
      },
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <CircularProgress color="secondary" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Typography variant="h4">¡Bienvenido a CACE!</Typography>
      <Typography variant="body1" gutterBottom>Tu sesión ha sido confirmada con éxito.</Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#222", color: "white", textAlign: "center", p: 2 }}>
            <Typography variant="h6">Total de Asistencias</Typography>
            <Typography variant="h4">1250</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#222", color: "white", textAlign: "center", p: 2 }}>
            <Typography variant="h6">Estudiantes Registrados</Typography>
            <Typography variant="h4">450</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#222", color: "white", textAlign: "center", p: 2 }}>
            <Typography variant="h6">Promedio de Asistencias</Typography>
            <Typography variant="h4">87%</Typography>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#222", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Asistencias de los últimos meses</Typography>
              <Bar data={barData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#222", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Asistencias por Grados</Typography>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default HomePage;
