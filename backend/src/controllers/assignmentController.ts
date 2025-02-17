import { Request, Response } from "express";
import assignmentModel from "../models/assignmentModel";

export const getAssignmentsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const assignments = await assignmentModel.getAssignmentsByUserId(parseInt(userId));
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error al obtener asignaciones:", error);
    res.status(500).json({ error: "Error al obtener asignaciones" });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const assignment = await assignmentModel.getAssignmentById(parseInt(id));
    if (!assignment) {
      res.status(404).json({ error: "Asignación no encontrada" });
      return;
    }
    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error al obtener asignación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createAssignment = async (req: Request, res: Response) => {
  const { user_id, group_id, subject_id } = req.body;
  try {
    const newAssignment = await assignmentModel.createAssignment({ user_id, group_id, subject_id });
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("Error al crear asignación:", error);
    res.status(500).json({ error: "Error al crear asignación" });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, group_id, subject_id } = req.body;
  try {
    const updatedAssignment = await assignmentModel.updateAssignment(parseInt(id), { user_id, group_id, subject_id });
    if (!updatedAssignment) {
      res.status(404).json({ error: "Asignación no encontrada" });
      return;
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error("Error al actualizar asignación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await assignmentModel.deleteAssignment(parseInt(id));
    res.status(200).json({ message: "Asignación eliminada" });
  } catch (error) {
    console.error("Error al eliminar asignación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
