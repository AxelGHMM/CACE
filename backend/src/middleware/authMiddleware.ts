import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del header Authorization

  if (!token) {
    res.status(401).json({ error: "Acceso denegado. No se proporcionó un token." });
    return; // Asegúrate de detener la ejecución aquí
  }

  try {
    const secret = process.env.JWT_SECRET || "secret"; // Cambia "secret" por tu valor real en el .env
    const decoded = jwt.verify(token, secret); // Verifica el token
    req.user = decoded; // Adjunta el usuario decodificado al request
    next(); // Continúa al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado." });
    return; // Detén la ejecución en caso de error
  }
};
