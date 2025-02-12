import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const app = express();

// Configuración de puertos y CORS
const PORT = process.env.BACKEND_PORT || 5000;

app.use(cors({
  origin: "*",  // Permitir cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); // Middleware para procesar JSON

// Rutas
app.use("/api/users", userRoutes);

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal.");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
