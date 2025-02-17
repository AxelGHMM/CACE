import { Request, Response } from "express";
import pool from "../config/db";
import { createGradesForStudent } from "../controllers/gradeController";

export const uploadStudents = async (req: Request, res: Response): Promise<void> => {
  const { data, groupId } = req.body;

  if (!groupId || !Array.isArray(data)) {
    res.status(400).json({ error: "Datos inválidos. Verifica el grupo y el archivo." });
    return;
  }

  try {
    for (const student of data) {
      const { name, email, matricula } = student;

      // Insertar estudiante en la tabla students si no existe
      const studentResult = await pool.query(
        `INSERT INTO students (name, email, matricula, group_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (matricula) 
         DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, group_id = EXCLUDED.group_id
         RETURNING id;`,
        [name, email || null, matricula, groupId]
      );

      const studentId = studentResult.rows[0].id;

      // Crear registros en grades para este estudiante si aún no existen
      await createGradesForStudent(studentId, groupId);
    }

    res.status(200).json({ message: "Archivo subido y estudiantes registrados correctamente." });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
