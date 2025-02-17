import { Request, Response } from "express";
import subjectModel from "../models/subjectModel";

// Obtener materia por ID
// Obtener materia por nombre
export const getSubjectByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;

  if (!name) {
    res.status(400).json({ error: "El nombre de la materia es requerido" });
    return;
  }

  try {
    const subject = await subjectModel.getSubjectByName(name);
    if (!subject) {
      res.status(404).json({ message: "Materia no encontrada" });
      return;
    }
    res.status(200).json(subject);
  } catch (error) {
    console.error("Error al obtener materia por nombre:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las materias
export const getAllSubjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await subjectModel.getAllSubjects();
    if (subjects.length === 0) {
      res.status(404).json({ message: "No se encontraron materias" });
      return;
    }
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error al obtener todas las materias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getSubjectById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const subject = await subjectModel.getSubjectById(parseInt(id));
    if (!subject) {
      res.status(404).json({ message: "Materia no encontrada" });
      return;
    }
    res.status(200).json(subject);
  } catch (error) {
    console.error("Error al obtener materia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nueva materia
export const createSubject = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "El nombre de la materia es requerido" });
    return;
  }

  try {
    const newSubject = await subjectModel.createSubject({ name });
    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error al crear materia:", error);
    res.status(500).json({ error: "Error al crear materia" });
  }
};

// Actualizar materia
export const updateSubject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "El nombre de la materia es requerido" });
    return;
  }

  try {
    const updatedSubject = await subjectModel.updateSubject(parseInt(id), name);
    if (!updatedSubject) {
      res.status(404).json({ message: "Materia no encontrada" });
      return;
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Error al actualizar materia:", error);
    res.status(500).json({ error: "Error al actualizar materia" });
  }
};

// Eliminar materia lógicamente
export const deleteSubject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await subjectModel.deleteSubject(parseInt(id));
    res.status(200).json({ message: "Materia eliminada lógicamente" });
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
  
};
