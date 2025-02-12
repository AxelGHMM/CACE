import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";

const StudentsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      
      // Envía el JSON al backend
      try {
        await axios.post("/api/upload", { data: jsonData });
        alert("Archivo subido con éxito");
      } catch (error) {
        console.error("Error al subir el archivo:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Subir Plantilla de Alumnos</Typography>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
        Subir Archivo
      </Button>
    </Box>
  );
};

export default StudentsPage;
