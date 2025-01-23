import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

// Controlador para crear un usuario

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "Todos los campos son obligatorios." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({ name, email, password: hashedPassword, role });

    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === "23505") {
      res.status(400).json({ error: "El email ya está registrado." });
    } else {
      console.error(error.message);
      res.status(500).send("Error en el servidor.");
    }
  }
};

// Controlador para iniciar sesión
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son obligatorios." });
      return;
    }

    const user = await userModel.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Contraseña incorrecta." });
      return;
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Información del payload
      process.env.JWT_SECRET || "defaultsecret", // Llave secreta
      { expiresIn: "1h" } // Expiración
    );

    res.status(200).json({ message: "Inicio de sesión exitoso.", token });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Error en el servidor.");
  }
};