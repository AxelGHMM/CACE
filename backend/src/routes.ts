// Archivo: adminRoutes.ts
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


// Archivo: assignmentRoutes.ts
import { Router } from "express";
import * as assignmentController from "../controllers/assignmentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/user/:userId", verifyToken, assignmentController.getAssignmentsByUserId);
router.get("/:id", verifyToken, assignmentController.getAssignmentById);
router.post("/", verifyToken, assignmentController.createAssignment);
router.put("/:id", verifyToken, assignmentController.updateAssignment);
router.delete("/:id", verifyToken, assignmentController.deleteAssignment);

export default router;


// Archivo: attendanceRoutes.ts
import { Router } from "express";
import * as attendanceController from "../controllers/attendanceController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Obtener lista de alumnos de un grupo y materia
router.get("/group/:groupId/subject/:subjectId", verifyToken, attendanceController.getAttendanceByGroupAndSubject);

// Enviar asistencias
router.post("/submit", verifyToken, attendanceController.createAttendances);

export default router;


// Archivo: gradeRoutes.ts
import { Router } from "express";
import * as gradeController from "../controllers/gradeController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/group/:groupId/subject/:subjectId/:partial?", verifyToken, gradeController.getGradesByGroupAndSubject);
router.put("/:id", verifyToken, gradeController.updateGrade);
router.get("/professor/:professorId", verifyToken, gradeController.getGradesByProfessor);

export default router;


// Archivo: groupRoutes.ts
import { Router } from "express";
import * as groupController from "../controllers/groupController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Ruta para obtener un grupo por nombre
router.get("/:name", verifyToken, groupController.getGroupByName);

// Ruta para obtener todos los grupos
router.get("/", verifyToken, groupController.getAllGroups);

// **Nueva ruta para crear un grupo**
router.post("/", verifyToken, groupController.createGroup);

export default router;


// Archivo: studentRoutes.ts
import { Router } from "express";
import * as studentController from "../controllers/studentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/:matricula", verifyToken, studentController.getStudentByMatricula);
router.get("/group/:groupId", verifyToken, studentController.getStudentsByGroup);

export default router;


// Archivo: subjectRoutes.ts
import { Router } from "express";
import * as subjectController from "../controllers/subjectController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id", verifyToken, subjectController.getSubjectById);
router.get("/name/:name", verifyToken, subjectController.getSubjectByName);
router.get("/", verifyToken, subjectController.getAllSubjects);
router.post("/", verifyToken, subjectController.createSubject);
router.put("/:id", verifyToken, subjectController.updateSubject);
router.delete("/:id", verifyToken, subjectController.deleteSubject);

export default router;


// Archivo: uploadRoutes.ts
import { Router } from "express";
import { uploadStudents } from "../controllers/uploadController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/upload", verifyToken, uploadStudents);

export default router;


// Archivo: userRoutes.ts
import { Router, Request, Response } from "express";
import * as userController from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";
import db from "../config/db"; // Ajusta esto según tu conexión a la BD
const router = Router();

router.post("/register", userController.createUser);


interface CustomRequest extends Request {
  user?: any; // Cambia 'any' por un tipo más específico si tienes uno
}


router.get("/me", verifyToken, (req: CustomRequest, res: Response) => {
  if (!req.user) {
    console.log("Usuario no encontrado en la solicitud.");
    res.status(404).json({ error: "Usuario no encontrado" }); // No uses `return` aquí
    return;
  }

  console.log("Usuario encontrado:", req.user);
  res.status(200).json(req.user);
});



router.post("/login", userController.loginUser);
router.get("/homepage/stats", verifyToken, async (req: CustomRequest, res: Response) => {
  try {
   
    // 🔹 Asistencias mensuales (últimos 5 meses)
    const attendanceDataResult = await db.query(`
      SELECT EXTRACT(MONTH FROM date) AS month, COUNT(*) AS count
      FROM attendances WHERE is_active = true
      GROUP BY month ORDER BY month;
    `);
    const attendanceData = Array(5).fill(0); // Inicializar con ceros

    attendanceDataResult.rows.forEach((row: any) => {
      const monthIndex = row.month - 1;
      if (monthIndex >= 0 && monthIndex < 5) {
        attendanceData[monthIndex] = row.count;
      }
    });

    // 🔹 Cantidad de estudiantes por grupo
    const gradesDataResult = await db.query(`
      SELECT g.id, COUNT(s.id) AS count
      FROM groups g
      LEFT JOIN students s ON s.group_id = g.id AND s.is_active = true
      GROUP BY g.id ORDER BY g.id;
    `);
    const gradesData = gradesDataResult.rows.map((row: any) => row.count);

    // 🔹 Respuesta con los datos de gráficas
    res.status(200).json({
      attendanceData,
      gradesData,
    });

  } catch (error) {
    console.error("Error en la carga de datos para gráficas:", error);
    res.status(500).json({ error: "Error en la carga de gráficas" });
  }
});
router.get("/homepage", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Bienvenido al HomePage", user: req.user });
});
router.get("/", verifyToken, userController.getUsers); // Obtener todos los usuarios
router.get("/:id", verifyToken, userController.getUserById); // Obtener usuario por ID
router.post("/", verifyToken, userController.createUser); // Crear usuario
router.put("/:id", verifyToken, userController.updateUser); // Actualizar usuario
router.delete("/:id", verifyToken, userController.deleteUser);
router.get("/role/:role", verifyToken, userController.getUsersByRole);

export default router;


