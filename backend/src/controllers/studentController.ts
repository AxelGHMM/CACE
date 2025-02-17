import { Request, Response } from "express";
import studentModel from "../models/studentModel";

// Obtener estudiante por matrícula
export const getStudentByMatricula = async (req: Request, res: Response): Promise<void> => {
  const { matricula } = req.params;

  if (!matricula) {
    res.status(400).json({ error: "La matrícula es requerida" });
    return;
  }

  try {
    const student = await studentModel.getStudentByMatricula(matricula);
    if (!student) {
      res.status(404).json({ message: "Estudiante no encontrado" });
      return;
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Error al obtener estudiante:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener estudiantes por grupo
export const getStudentsByGroup = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;

  if (!groupId || isNaN(parseInt(groupId))) {
    res.status(400).json({ error: "El ID del grupo es requerido y debe ser un número válido" });
    return;
  }

  try {
    const students = await studentModel.getStudentsByGroup(parseInt(groupId));
    if (students.length === 0) {
      res.status(404).json({ message: "No se encontraron estudiantes para este grupo" });
      return;
    }
    res.status(200).json(students);
  } catch (error) {
    console.error("Error al obtener estudiantes del grupo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
