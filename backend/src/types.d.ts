import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Agregar la propiedad `user` al tipo Request
    }
  }
}
