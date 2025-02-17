import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Snackbar,
  Alert, // 🔹 Importar Alert para usar en el Snackbar
} from "@mui/material";
import api from "../../utils/api";
import DashboardLayout from "../Layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

const GradesPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [partials] = useState<number[]>([1, 2, 3]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedPartial, setSelectedPartial] = useState<number | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [editedGrades, setEditedGrades] = useState<Record<number, any>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/assignments/user/${user.id}`);
        setAssignments(response.data);
        const uniqueGroups = response.data.reduce((acc: any[], curr) => {
          if (!acc.find((g) => g.id === curr.group_id)) {
            acc.push({ id: curr.group_id, name: curr.group_name });
          }
          return acc;
        }, []);
        setGroups(uniqueGroups);
        setSubjects([]);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      }
    };

    fetchAssignments();
  }, [user]);

  useEffect(() => {
    if (!selectedGroup) return;
    const relatedSubjects = assignments
      .filter((a) => a.group_id === selectedGroup)
      .map((a) => ({ id: a.subject_id, name: a.subject_name }));
    setSubjects(relatedSubjects);
    setSelectedSubject(null);
  }, [selectedGroup, assignments]);

  const fetchGrades = async () => {
    if (!selectedGroup || !selectedSubject || !selectedPartial) return;
    try {
      const response = await api.get(
        `/grade/group/${selectedGroup}/subject/${selectedSubject}/${selectedPartial}`
      );
      const sortedGrades = response.data.sort((a: any, b: any) => a.matricula.localeCompare(b.matricula));
      setGrades(sortedGrades);
    } catch (error) {
      console.error("Error al obtener calificaciones:", error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedGroup, selectedSubject, selectedPartial]);

  const handleChange = (id: number, field: string, value: string) => {
    setEditedGrades((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/grade/${id}`, editedGrades[id]);

      setSnackbar({ open: true, message: "Calificación guardada con éxito", severity: "success" });

      setEditedGrades({});
      fetchGrades();
    } catch (error) {
      console.error("Error al actualizar calificación:", error);
      setSnackbar({ open: true, message: "Error al guardar la calificación", severity: "error" });
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: "#121212", color: "white", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>Gestión de Calificaciones</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "white" }}>Grupo</InputLabel>
          <Select
            value={selectedGroup ?? ""}
            onChange={(e) => setSelectedGroup(Number(e.target.value))}
            sx={{ bgcolor: "#282828", color: "white" }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "white" }}>Materia</InputLabel>
          <Select
            value={selectedSubject ?? ""}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            sx={{ bgcolor: "#282828", color: "white" }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "white" }}>Parcial</InputLabel>
          <Select
            value={selectedPartial ?? ""}
            onChange={(e) => setSelectedPartial(Number(e.target.value))}
            sx={{ bgcolor: "#282828", color: "white" }}
          >
            {partials.map((partial) => (
              <MenuItem key={partial} value={partial}>
                Parcial {partial}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box component={Paper} sx={{ mt: 3, maxHeight: 400, overflow: "auto", bgcolor: "#1E1E1E", p: 2 }}>
          <Typography variant="h6" color="white">Lista de Calificaciones</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Matrícula</TableCell>
                <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                <TableCell sx={{ color: "white" }}>Actividad 1</TableCell>
                <TableCell sx={{ color: "white" }}>Actividad 2</TableCell>
                <TableCell sx={{ color: "white" }}>Asistencia</TableCell>
                <TableCell sx={{ color: "white" }}>Proyecto</TableCell>
                <TableCell sx={{ color: "white" }}>Examen</TableCell>
                <TableCell sx={{ color: "white" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell sx={{ color: "white" }}>{grade.matricula}</TableCell>
                  <TableCell sx={{ color: "white" }}>{grade.name}</TableCell>
                  {["activity_1", "activity_2", "attendance", "project", "exam"].map((field) => (
                    <TableCell key={field}>
                      <TextField
                        value={editedGrades[grade.id]?.[field] ?? grade[field]}
                        onChange={(e) => handleChange(grade.id, field, e.target.value)}
                        sx={{ input: { color: "white" }, bgcolor: "#282828" }}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="contained" onClick={() => handleSave(grade.id)} sx={{ bgcolor: "#800080" }}>
                      Guardar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* 🔹 Snackbar para mostrar alertas */}
        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default GradesPage;
