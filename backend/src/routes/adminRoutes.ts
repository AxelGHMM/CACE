import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import db from "../config/db"; // Ajusta esto según tu conexión a la BD

const router = Router();

router.get("/homepage", verifyToken, async (req, res) => {
    try {
      // 📌 Extrae los datos correctamente con `rows`
      const totalUsersResult = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
      const totalSubjectsResult = await db.query("SELECT COUNT(*) AS totalSubjects FROM subjects");
      const totalGroupsResult = await db.query("SELECT COUNT(*) AS totalGroups FROM groups");
  
      const usersByRoleResult = await db.query(
        `SELECT role, COUNT(*) AS count FROM users GROUP BY role`
      );
  
      const subjectsByGroupResult = await db.query(
        `SELECT g.name AS group_name, COUNT(s.id) AS subject_count
         FROM groups g
         LEFT JOIN assignments a ON a.group_id = g.id
         LEFT JOIN subjects s ON s.id = a.subject_id
         GROUP BY g.id, g.name`
      );
      
  
      // 📌 Asegurar que se extraen los valores correctamente
      const totalUsers = totalUsersResult.rows[0].totalusers;
      const totalSubjects = totalSubjectsResult.rows[0].totalsubjects;
      const totalGroups = totalGroupsResult.rows[0].totalgroups;
  
      const roles: { admin: number; professor: number; student: number } = { 
        admin: 0, 
        professor: 0, 
        student: 0 
      };
  
      usersByRoleResult.rows.forEach((row) => {
        const roleKey = row.role as keyof typeof roles; // 🔹 Convertir a clave válida
        if (roles.hasOwnProperty(roleKey)) {
          roles[roleKey] = row.count;
        }
      });
  
      const subjectsByGroup = subjectsByGroupResult.rows.map((g) => g.subjectcount);
  
      res.json({
        totalUsers,
        totalSubjects,
        totalGroups,
        usersByRole: [roles.admin, roles.professor, roles.student],
        subjectsByGroup,
      });
    } catch (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({ message: "Error al obtener datos" });
    }
  });
  

export default router;
