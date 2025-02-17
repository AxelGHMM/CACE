import { Request, Response } from "express";
import groupModel from "../models/groupModel";

// Obtener grupo por nombre
export const getGroupByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;

  if (!name) {
    res.status(400).json({ error: "El nombre del grupo es requerido" });
    return;
  }

  try {
    const group = await groupModel.getGroupByName(name);
    if (!group) {
      res.status(404).json({ message: "Grupo no encontrado" });
      return;
    }
    res.status(200).json(group);
  } catch (error) {
    console.error("Error al obtener grupo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todos los grupos
export const getAllGroups = async (_req: Request, res: Response): Promise<void> => {
  try {
    const groups = await groupModel.getAllGroups();
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear un nuevo grupo
export const createGroup = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "El nombre del grupo es requerido" });
    return;
  }

  try {
    const group = await groupModel.createGroup(name);
    res.status(201).json(group);
  } catch (error) {
    console.error("Error al crear grupo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
