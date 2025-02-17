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
} from "@mui/material";
import api from "../../utils/api";
import * as XLSX from "xlsx";
import DashELayout from "../Layout/DashELayout";
import useAdminAuth from "../../hooks/useAdminAuth";

const StudentsPage: React.FC = () => {
  const isAdmin = useAdminAuth(); // 🔹 Protege la página para admins

  if (!isAdmin) return null; // 🔹 Evita renderizar si no es admin

  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupForAssignment, setSelectedGroupForAssignment] = useState<number | null>(null);
  const [selectedGroupForUpload, setSelectedGroupForUpload] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Obtener profesores, grupos y materias
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsResponse, groupsResponse, subjectsResponse] = await Promise.all([
          api.get("/users/role/professor"),
          api.get("/groups"),
          api.get("/subjects"),
        ]);
        setProfessors(professorsResponse.data);
        setGroups(groupsResponse.data);
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setPreviewData(jsonData);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleAssign = async () => {
    if (!selectedProfessor || !selectedGroupForAssignment || !selectedSubject) {
      alert("Por favor, selecciona profesor, grupo y materia.");
      return;
    }

    try {
      await api.post("/assignments", {
        user_id: selectedProfessor,
        group_id: selectedGroupForAssignment,
        subject_id: selectedSubject,
      });
      alert("Asignación realizada con éxito.");
    } catch (error) {
      console.error("Error al asignar:", error);
      alert("Error al realizar la asignación.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    if (!selectedGroupForUpload) {
      alert("Por favor, selecciona un grupo antes de subir el archivo.");
      return;
    }

    try {
      await api.post("/upload", { data: previewData, groupId: selectedGroupForUpload });
      alert("Archivo subido con éxito.");
      setFile(null);
      setPreviewData([]);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    }
  };

  return (
    <DashELayout>
    <Box sx={{ p: 4, bgcolor: "#121212", color: "#ffffff", minHeight: "100vh", overflowY: "auto" }}>
    <Typography variant="h4" gutterBottom>Gestión de Profesores y Estudiantes</Typography>
  
      {/* Asignar Profesor a Grupo y Materia */}
      <Typography variant="h6" sx={{ mt: 3 }}>Asignar Profesor a Grupo y Materia</Typography>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Profesor</InputLabel>
        <Select
          value={selectedProfessor ?? ""}
          onChange={(e) => setSelectedProfessor(Number(e.target.value))}
          sx={{
            bgcolor: "#282828", // 🔹 Fondo oscuro
            color: "white", // 🔹 Texto blanco
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } }, // 🔹 Menú desplegable oscuro
          }}
        >
          {professors.map((professor) => (
            <MenuItem key={professor.id} value={professor.id}>
              {professor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Grupo</InputLabel>
        <Select
          value={selectedGroupForAssignment ?? ""}
          onChange={(e) => setSelectedGroupForAssignment(Number(e.target.value))}
          sx={{
            bgcolor: "#282828",
            color: "white",
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } },
          }}
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
          sx={{
            bgcolor: "#282828",
            color: "white",
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } },
          }}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <Button variant="contained" sx={{ mt: 2, bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }} onClick={handleAssign}>
        Asignar Materia y Grupo
      </Button>
  
      {/* Subir Lista de Alumnos */}
      <Typography variant="h6" sx={{ mt: 4 }}>Subir Lista de Alumnos</Typography>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Grupo para Subida</InputLabel>
        <Select
          value={selectedGroupForUpload ?? ""}
          onChange={(e) => setSelectedGroupForUpload(Number(e.target.value))}
          sx={{
            bgcolor: "#282828",
            color: "white",
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } },
          }}
        >
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <Box sx={{ mt: 2 }}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{ color: "white" }} />
      </Box>
  
      {previewData.length > 0 && (
        <Box component={Paper} sx={{ mt: 4, p: 2, maxHeight: 300, overflowY: "auto", bgcolor: "#1E1E1E" }}>
          <Typography variant="h6">Vista Previa de la Lista</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Matrícula</TableCell>
                <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {previewData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "white" }}>{student.matricula}</TableCell>
                  <TableCell sx={{ color: "white" }}>{student.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>{student.email || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
  
      <Button variant="contained" sx={{ mt: 2, bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }} onClick={handleUpload} disabled={!file}>
        Subir Archivo
      </Button>
    </Box>
  </DashELayout>
  
  );
};

export default StudentsPage;
