
// ==== Directorio: config ====

// Archivo: db.ts
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mydb",
  password: process.env.DB_PASSWORD || "1234",
  port: parseInt(process.env.DB_PORT || "5432"),
});

pool.on("connect", () => {
  console.log("Conectado a la base de datos");
});

export default pool;



// ==== Directorio: controllers ====

// Archivo: assignmentController.ts
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


// Archivo: attendanceController.ts
import { Request, Response } from "express";
import attendanceModel from "../models/attendanceModel";

// Obtener lista de alumnos por grupo y materia
export const getAttendanceByGroupAndSubject = async (req: Request, res: Response) => {
  const { groupId, subjectId } = req.params;

  if (!groupId || !subjectId) {
    res.status(400).json({ error: "groupId y subjectId son requeridos" });
    return;
  }

  try {
    const students = await attendanceModel.getAttendanceByGroupAndSubject(parseInt(groupId), parseInt(subjectId));
    if (students.length === 0) {
      res.status(404).json({ message: "No hay alumnos en este grupo" });
      return;
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error al obtener asistencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Registrar asistencias
export const createAttendances = async (req: Request, res: Response) => {
  const { group_id, subject_id, date, attendances } = req.body;
  const user_id = req.user?.id;

  if (!group_id || !subject_id || !date || !attendances || !Array.isArray(attendances)) {
    res.status(400).json({ error: "group_id, subject_id, date y attendances son requeridos" });
    return;
  }

  if (!user_id) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    const formattedAttendances = attendances.map(att => ({
      student_id: att.student_id,
      user_id,
      subject_id,
      date,
      status: att.status.toLowerCase(),
    }));

    const newAttendances = await attendanceModel.createAttendances(formattedAttendances);
    res.status(201).json({ message: "Asistencia registrada", data: newAttendances });
  } catch (error) {
    console.error("Error al registrar asistencias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Archivo: gradeController.ts
import { Request, Response } from "express";
import gradeModel from "../models/gradeModel";

// 🔹 Crear registros en la tabla grades cuando se inscribe un estudiante
export const createGradesForStudent = async (studentId: number, groupId: number) => {
  try {
    await gradeModel.createGradesForStudent(studentId, groupId);
  } catch (error) {
    console.error("Error al crear registros en grades:", error);
  }
};

// 🔹 Obtener calificaciones de un grupo y materia específicos
export const getGradesByGroupAndSubject = async (req: Request, res: Response): Promise<void> => {
  const { groupId, subjectId, partial } = req.params;
  console.log("🔹 Parámetros recibidos:", { groupId, subjectId, partial });

  try {
    const grades = await gradeModel.getGradesByGroupAndSubject(parseInt(groupId), parseInt(subjectId), partial ? parseInt(partial) : null);
    console.log("📌 Calificaciones obtenidas:", grades);
    res.status(200).json(grades);
  } catch (error) {
    console.error("❌ Error al obtener calificaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// 🔹 Obtener todas las calificaciones de un profesor autenticado
export const getGradesByProfessor = async (req: Request, res: Response): Promise<void> => {
  const { professorId } = req.params;

  try {
    const grades = await gradeModel.getGradesByProfessor(parseInt(professorId));
    res.status(200).json(grades);
  } catch (error) {
    console.error("Error al obtener calificaciones del profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔹 Actualizar calificaciones de un estudiante
export const updateGrade = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { activity_1, activity_2, attendance, project, exam } = req.body;

  try {
    const updatedGrade = await gradeModel.updateGrade(parseInt(id), { activity_1, activity_2, attendance, project, exam });
    if (!updatedGrade) {
      res.status(404).json({ error: "Registro de calificación no encontrado" });
      return;
    }
    res.status(200).json({ message: "Calificación actualizada", grade: updatedGrade });
  } catch (error) {
    console.error("Error al actualizar calificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Archivo: groupController.ts
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


// Archivo: studentController.ts
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


// Archivo: subjectController.ts
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


// Archivo: uploadController.ts
import { Request, Response } from "express";
import pool from "../config/db";
import { createGradesForStudent } from "../controllers/gradeController";

export const uploadStudents = async (req: Request, res: Response): Promise<void> => {
  const { data, groupId } = req.body;

  if (!groupId || !Array.isArray(data)) {
    res.status(400).json({ error: "Datos inválidos. Verifica el grupo y el archivo." });
    return;
  }

  try {
    for (const student of data) {
      const { name, email, matricula } = student;

      // Insertar estudiante en la tabla students si no existe
      const studentResult = await pool.query(
        `INSERT INTO students (name, email, matricula, group_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (matricula) 
         DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, group_id = EXCLUDED.group_id
         RETURNING id;`,
        [name, email || null, matricula, groupId]
      );

      const studentId = studentResult.rows[0].id;

      // Crear registros en grades para este estudiante si aún no existen
      await createGradesForStudent(studentId, groupId);
    }

    res.status(200).json({ message: "Archivo subido y estudiantes registrados correctamente." });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Archivo: userController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userModel.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: "Todos los campos son obligatorios." });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const updatedUser = await userModel.updateUser(parseInt(id), { name, email, password, role });
    if (!updatedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
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

    // Generar el token con una duración de 1 hora
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

// Eliminar usuario lógicamente
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await userModel.deleteUser(parseInt(id));
    res.status(200).json({ message: "Usuario eliminado lógicamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
  
};
export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.params; // El rol se obtiene de los parámetros de la URL
  try {
    const users = await userModel.getUsersByRole(role);
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error al obtener usuarios con rol ${role}:`, error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};




// ==== Directorio: . ====

// Archivo: controllers.ts
// Archivo: assignmentController.ts
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


// Archivo: attendanceController.ts
import { Request, Response } from "express";
import attendanceModel from "../models/attendanceModel";

// Obtener lista de alumnos por grupo y materia
export const getAttendanceByGroupAndSubject = async (req: Request, res: Response) => {
  const { groupId, subjectId } = req.params;

  if (!groupId || !subjectId) {
    res.status(400).json({ error: "groupId y subjectId son requeridos" });
    return;
  }

  try {
    const students = await attendanceModel.getAttendanceByGroupAndSubject(parseInt(groupId), parseInt(subjectId));
    if (students.length === 0) {
      res.status(404).json({ message: "No hay alumnos en este grupo" });
      return;
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error al obtener asistencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Registrar asistencias
export const createAttendances = async (req: Request, res: Response) => {
  const { group_id, subject_id, date, attendances } = req.body;
  const user_id = req.user?.id;

  if (!group_id || !subject_id || !date || !attendances || !Array.isArray(attendances)) {
    res.status(400).json({ error: "group_id, subject_id, date y attendances son requeridos" });
    return;
  }

  if (!user_id) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    const formattedAttendances = attendances.map(att => ({
      student_id: att.student_id,
      user_id,
      subject_id,
      date,
      status: att.status.toLowerCase(),
    }));

    const newAttendances = await attendanceModel.createAttendances(formattedAttendances);
    res.status(201).json({ message: "Asistencia registrada", data: newAttendances });
  } catch (error) {
    console.error("Error al registrar asistencias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Archivo: gradeController.ts
import { Request, Response } from "express";
import gradeModel from "../models/gradeModel";

// 🔹 Crear registros en la tabla grades cuando se inscribe un estudiante
export const createGradesForStudent = async (studentId: number, groupId: number) => {
  try {
    await gradeModel.createGradesForStudent(studentId, groupId);
  } catch (error) {
    console.error("Error al crear registros en grades:", error);
  }
};

// 🔹 Obtener calificaciones de un grupo y materia específicos
export const getGradesByGroupAndSubject = async (req: Request, res: Response): Promise<void> => {
  const { groupId, subjectId, partial } = req.params;
  console.log("🔹 Parámetros recibidos:", { groupId, subjectId, partial });

  try {
    const grades = await gradeModel.getGradesByGroupAndSubject(parseInt(groupId), parseInt(subjectId), partial ? parseInt(partial) : null);
    console.log("📌 Calificaciones obtenidas:", grades);
    res.status(200).json(grades);
  } catch (error) {
    console.error("❌ Error al obtener calificaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// 🔹 Obtener todas las calificaciones de un profesor autenticado
export const getGradesByProfessor = async (req: Request, res: Response): Promise<void> => {
  const { professorId } = req.params;

  try {
    const grades = await gradeModel.getGradesByProfessor(parseInt(professorId));
    res.status(200).json(grades);
  } catch (error) {
    console.error("Error al obtener calificaciones del profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// 🔹 Actualizar calificaciones de un estudiante
export const updateGrade = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { activity_1, activity_2, attendance, project, exam } = req.body;

  try {
    const updatedGrade = await gradeModel.updateGrade(parseInt(id), { activity_1, activity_2, attendance, project, exam });
    if (!updatedGrade) {
      res.status(404).json({ error: "Registro de calificación no encontrado" });
      return;
    }
    res.status(200).json({ message: "Calificación actualizada", grade: updatedGrade });
  } catch (error) {
    console.error("Error al actualizar calificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Archivo: groupController.ts
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


// Archivo: studentController.ts
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


// Archivo: subjectController.ts
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


// Archivo: uploadController.ts
import { Request, Response } from "express";
import pool from "../config/db";
import { createGradesForStudent } from "../controllers/gradeController";

export const uploadStudents = async (req: Request, res: Response): Promise<void> => {
  const { data, groupId } = req.body;

  if (!groupId || !Array.isArray(data)) {
    res.status(400).json({ error: "Datos inválidos. Verifica el grupo y el archivo." });
    return;
  }

  try {
    for (const student of data) {
      const { name, email, matricula } = student;

      // Insertar estudiante en la tabla students si no existe
      const studentResult = await pool.query(
        `INSERT INTO students (name, email, matricula, group_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (matricula) 
         DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, group_id = EXCLUDED.group_id
         RETURNING id;`,
        [name, email || null, matricula, groupId]
      );

      const studentId = studentResult.rows[0].id;

      // Crear registros en grades para este estudiante si aún no existen
      await createGradesForStudent(studentId, groupId);
    }

    res.status(200).json({ message: "Archivo subido y estudiantes registrados correctamente." });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Archivo: userController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userModel.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(parseInt(id));
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: "Todos los campos son obligatorios." });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const updatedUser = await userModel.updateUser(parseInt(id), { name, email, password, role });
    if (!updatedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
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

    // Generar el token con una duración de 1 hora
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

// Eliminar usuario lógicamente
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await userModel.deleteUser(parseInt(id));
    res.status(200).json({ message: "Usuario eliminado lógicamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
  
};
export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.params; // El rol se obtiene de los parámetros de la URL
  try {
    const users = await userModel.getUsersByRole(role);
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error al obtener usuarios con rol ${role}:`, error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};





// Archivo: index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import studentRoutes from "./routes/studentRoutes";
import groupRoutes from "./routes/groupRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import adminRoutes from "./routes/adminRoutes"
import uploadRoutes from "./routes/uploadRoutes"; // Importar las rutas de upload

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
app.use("/api/grade", gradeRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api", uploadRoutes); // Nueva ruta para la carga de archivos
app.use("/api/admin", adminRoutes);

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal.");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});


// Archivo: merge.ts
import * as fs from "fs";
import * as path from "path";

const folderPath = "./"; // Carpeta base donde están los archivos .ts
const outputFile = "backendd.ts"; // Nombre del archivo final

// Función para recorrer directorios y leer archivos .ts
const getFilesRecursively = (dir: string): string[] => {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath)); // Si es directorio, recursivamente buscar archivos
        } else if (file.endsWith(".ts")) {
            results.push(filePath); // Agregar solo archivos .ts
        }
    });

    return results;
};

// Obtener todos los archivos .ts dentro de `src/`
const files = getFilesRecursively(folderPath);

// Organizar archivos por directorio
const filesByDirectory: Record<string, string[]> = {};

// Clasificar archivos por carpeta
files.forEach((filePath) => {
    const relativeDir = path.dirname(filePath).replace(folderPath, "").replace(/^\/|\\/g, "");
    if (!filesByDirectory[relativeDir]) {
        filesByDirectory[relativeDir] = [];
    }
    filesByDirectory[relativeDir].push(filePath);
});

let content = "";

// Recorrer los directorios y escribir los archivos dentro de cada uno
for (const [dir, filePaths] of Object.entries(filesByDirectory)) {
    content += `\n// ==== Directorio: ${dir || "src"} ====\n\n`;
    filePaths.forEach((filePath) => {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, "utf8");
        content += `// Archivo: ${fileName}\n${fileContent}\n\n`;
    });
}

// Escribir todo en el archivo final
fs.writeFileSync(outputFile, content);

console.log(`✅ Archivos combinados en ${outputFile}`);


// Archivo: models.ts
// Archivo: assignmentModel.ts
import pool from "../config/db";

interface Assignment {
  id?: number;
  user_id: number;
  group_id: number;
  subject_id: number;
  is_active?: boolean;
}

const getAssignmentsByUserId = async (userId: number): Promise<Assignment[]> => {
  const query = `
    SELECT 
      a.id, 
      a.user_id, 
      a.group_id, 
      g.name AS group_name, 
      a.subject_id, 
      s.name AS subject_name 
    FROM assignments a
    JOIN groups g ON a.group_id = g.id
    JOIN subjects s ON a.subject_id = s.id
    WHERE a.user_id = $1 AND a.is_active = true;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};


const getAssignmentById = async (id: number): Promise<Assignment | undefined> => {
  const query = `SELECT * FROM assignments WHERE id = $1 AND is_active = true;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
  const query = `
    INSERT INTO assignments (user_id, group_id, subject_id, is_active)
    VALUES ($1, $2, $3, true)
    RETURNING *;
  `;
  const values = [assignment.user_id, assignment.group_id, assignment.subject_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateAssignment = async (id: number, assignment: Partial<Assignment>): Promise<Assignment | undefined> => {
  const query = `
    UPDATE assignments
    SET user_id = COALESCE($1, user_id),
        group_id = COALESCE($2, group_id),
        subject_id = COALESCE($3, subject_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND is_active = true
    RETURNING *;
  `;
  const values = [assignment.user_id, assignment.group_id, assignment.subject_id, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteAssignment = async (id: number): Promise<void> => {
  const query = `UPDATE assignments SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1;`;
  await pool.query(query, [id]);
};

export default {
  getAssignmentsByUserId,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};


// Archivo: attendanceModel.ts
import pool from "../config/db";

interface Attendance {
  id?: number;
  student_id: number;
  user_id: number;
  subject_id: number;
  date: string;
  status: "presente" | "ausente" | "retardo";
}

// Obtener lista de alumnos por grupo y materia
const getAttendanceByGroupAndSubject = async (groupId: number, subjectId: number) => {
  const query = `
    SELECT s.id AS student_id, s.matricula, s.name
    FROM students s
    WHERE s.group_id = $1
  `;
  const result = await pool.query(query, [groupId]);
  return result.rows.map((student) => ({
    ...student,
    status: "presente", // Todos inician como presentes por defecto
  }));
};

// Registrar múltiples asistencias en una sola consulta
const createAttendances = async (attendances: Attendance[]) => {
  if (attendances.length === 0) {
    throw new Error("No hay asistencias para registrar");
  }

  const query = `
    INSERT INTO attendances (student_id, user_id, subject_id, date, status)
    VALUES ${attendances.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
    RETURNING *;
  `;

  const values = attendances.flatMap(attendance => [
    attendance.student_id,
    attendance.user_id,
    attendance.subject_id,
    attendance.date,
    attendance.status.toLowerCase(),
  ]);

  const result = await pool.query(query, values);
  return result.rows;
};

export default {
  getAttendanceByGroupAndSubject,
  createAttendances,
};


// Archivo: gradeModel.ts
import pool from "../config/db";

interface Grade {
  id?: number;
  student_id: number;
  professor_id: number;
  subject_id: number;
  partial: number;
  activity_1?: number;
  activity_2?: number;
  attendance?: number;
  project?: number;
  exam?: number;
  is_active?: boolean;
}

// 🔹 Crear registros en la tabla grades cuando se inscribe un estudiante
const createGradesForStudent = async (studentId: number, groupId: number): Promise<void> => {
  try {
    const queryCheck = `
      SELECT COUNT(*) as count FROM grades g
      JOIN assignments a ON g.professor_id = a.user_id AND g.subject_id = a.subject_id
      WHERE g.student_id = $1 AND a.group_id = $2;
    `;

    const checkResult = await pool.query(queryCheck, [studentId, groupId]);
    const existingCount = parseInt(checkResult.rows[0].count);

    // Si ya existen 3 registros, no inserta nada
    if (existingCount >= 3) {
      console.log(`🔍 El estudiante ${studentId} ya tiene sus calificaciones registradas.`);
      return;
    }

    console.log(`✅ Creando calificaciones para el estudiante ${studentId}`);

    const queryInsert = `
      INSERT INTO grades (student_id, professor_id, subject_id, partial, activity_1, activity_2, attendance, project, exam, is_active)
      SELECT $1, a.user_id, a.subject_id, p.partial, 0, 0, 0, 0, 0, true
      FROM assignments a
      CROSS JOIN generate_series(1, 3) AS p(partial)
      WHERE a.group_id = $2
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(queryInsert, [studentId, groupId]);
  } catch (error) {
    console.error(`❌ Error al crear registros en grades para estudiante ${studentId}:`, error);
  }
};


// 🔹 Obtener calificaciones por grupo y materia
const getGradesByGroupAndSubject = async (groupId: number, subjectId: number, partial: number | null): Promise<Grade[]> => {
  console.log("🔹 Ejecutando consulta SQL con:", { groupId, subjectId, partial });

  const query = `
    SELECT g.id, s.matricula, s.name, g.partial, g.activity_1, g.activity_2, g.attendance, g.project, g.exam
    FROM grades g
    JOIN students s ON g.student_id = s.id
    WHERE s.group_id = $1 AND g.subject_id = $2
    ${partial ? "AND g.partial = $3" : ""}
    AND g.is_active = true
    ORDER BY s.name;
  `;

  const values = partial ? [groupId, subjectId, partial] : [groupId, subjectId];
  const result = await pool.query(query, values);
  
  console.log("📌 Resultados de la consulta:", result.rows);
  return result.rows;
};


// 🔹 Obtener calificaciones de todos los grupos y materias de un profesor
const getGradesByProfessor = async (professorId: number): Promise<Grade[]> => {
  const query = `
    SELECT g.id, s.matricula, s.name, g.partial, g.activity_1, g.activity_2, g.attendance, g.project, g.exam, a.group_id, a.subject_id
    FROM grades g
    JOIN students s ON g.student_id = s.id
    JOIN assignments a ON g.professor_id = a.user_id AND g.subject_id = a.subject_id
    WHERE g.professor_id = $1 AND g.is_active = true
    ORDER BY a.group_id, a.subject_id, s.name, g.partial;
  `;
  const result = await pool.query(query, [professorId]);
  return result.rows;
};

// 🔹 Actualizar una calificación específica
const updateGrade = async (id: number, updatedFields: Partial<Grade>): Promise<Grade | undefined> => {
  const query = `
    UPDATE grades
    SET 
      activity_1 = COALESCE($1, activity_1),
      activity_2 = COALESCE($2, activity_2),
      attendance = COALESCE($3, attendance),
      project = COALESCE($4, project),
      exam = COALESCE($5, exam),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND is_active = true
    RETURNING *;
  `;
  const values = [updatedFields.activity_1, updatedFields.activity_2, updatedFields.attendance, updatedFields.project, updatedFields.exam, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  createGradesForStudent,
  getGradesByGroupAndSubject,
  getGradesByProfessor,
  updateGrade,
};


// Archivo: groupModel.ts
import pool from "../config/db";

interface Group {
  id?: number;
  name: string;
  is_active?: boolean;
}

const getGroupByName = async (name: string): Promise<Group | undefined> => {
  const query = `SELECT * FROM groups WHERE name = $1;`;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

const getAllGroups = async (): Promise<Group[]> => {
  const query = `SELECT * FROM groups;`;
  const result = await pool.query(query);
  return result.rows;
};

const createGroup = async (name: string): Promise<Group> => {
  const query = `INSERT INTO groups (name) VALUES ($1) RETURNING *;`;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

export default {
  getGroupByName,
  getAllGroups,
  createGroup,
};


// Archivo: studentModel.ts
import pool from "../config/db";

interface Student {
  id?: number;
  name: string;
  email?: string;
  matricula: string;
  group_id: number;
  is_active?: boolean;
}

const getStudentByMatricula = async (matricula: string): Promise<Student | undefined> => {
  const query = `SELECT * FROM students WHERE matricula = $1;`;
  const result = await pool.query(query, [matricula]);
  return result.rows[0];
};

const getStudentsByGroup = async (groupId: number): Promise<Student[]> => {
  const query = `SELECT * FROM students WHERE group_id = $1;`;
  const result = await pool.query(query, [groupId]);
  return result.rows;
};

export default {
  getStudentByMatricula,
  getStudentsByGroup,
};


// Archivo: subjectModel.ts
import pool from "../config/db";

interface Subject {
  id?: number;
  name: string;
  is_active?: boolean;
}

const getSubjectById = async (id: number): Promise<Subject | undefined> => {
  const query = `SELECT * FROM subjects WHERE id = $1 AND is_active = true;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getSubjectByName = async (name: string): Promise<Subject | undefined> => {
  const query = `SELECT * FROM subjects WHERE name = $1 AND is_active = true;`;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

const getAllSubjects = async (): Promise<Subject[]> => {
  const query = `SELECT * FROM subjects WHERE is_active = true;`;
  const result = await pool.query(query);
  return result.rows;
};

const createSubject = async (subject: Subject): Promise<Subject> => {
  const query = `INSERT INTO subjects (name, is_active) VALUES ($1, true) RETURNING *;`;
  const result = await pool.query(query, [subject.name]);
  return result.rows[0];
};

const updateSubject = async (id: number, name: string): Promise<Subject | undefined> => {
  const query = `
    UPDATE subjects
    SET name = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND is_active = true
    RETURNING *;
  `;
  const result = await pool.query(query, [name, id]);
  return result.rows[0];
};

const deleteSubject = async (id: number): Promise<void> => {
  const query = `UPDATE subjects SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1;`;
  await pool.query(query, [id]);
};

export default {
  getSubjectById,
  getSubjectByName,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};


// Archivo: userModel.ts
import pool from "../config/db";

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active?: boolean;
}

const getUsers = async (): Promise<User[]> => {
  const query = `SELECT * FROM users WHERE is_active = true;`;
  const result = await pool.query(query);
  return result.rows;
};

const getUsersByRole = async (role: string): Promise<User[]> => {
  const query = `SELECT * FROM users WHERE role = $1 AND is_active = true;`;
  const result = await pool.query(query, [role]);
  return result.rows;
};

const getUserById = async (id: number): Promise<User | undefined> => {
  const query = `SELECT * FROM users WHERE id = $1 AND is_active = true;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createUser = async (user: User): Promise<User> => {
  const query = `
    INSERT INTO users (name, email, password, role, is_active)
    VALUES ($1, $2, $3, $4, true)
    RETURNING *;
  `;
  const result = await pool.query(query, [user.name, user.email, user.password, user.role]);
  return result.rows[0];
};

const updateUser = async (id: number, user: Partial<User>): Promise<User | undefined> => {
  const query = `
    UPDATE users
    SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        role = COALESCE($4, role),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND is_active = true
    RETURNING *;
  `;
  const values = [user.name, user.email, user.password, user.role, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteUser = async (id: number): Promise<void> => {
  const query = `UPDATE users SET is_active = false, deleted_at = CURRENT_TIMESTAMP WHERE id = $1;`;
  await pool.query(query, [id]);
};

export default {
  getUsers,
  getUsersByRole,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};




// Archivo: routes.ts
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




// Archivo: types.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: number; role?: string };  // El tipo ahora incluye `id`
    }
  }
}



// ==== Directorio: middleware ====

// Archivo: authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: number;
  role?: string;
}

interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "defaultsecret";
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      res.status(401).json({ error: "Token expirado" });
      return;
    }

    // Asigna el token decodificado a `req.user` con el tipo correcto
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    res.status(401).json({ error: "Token inválido" });
  }
};


// Archivo: errorHandler.ts
 



// ==== Directorio: models ====

// Archivo: assignmentModel.ts
import pool from "../config/db";

interface Assignment {
  id?: number;
  user_id: number;
  group_id: number;
  subject_id: number;
  is_active?: boolean;
}

const getAssignmentsByUserId = async (userId: number): Promise<Assignment[]> => {
  const query = `
    SELECT 
      a.id, 
      a.user_id, 
      a.group_id, 
      g.name AS group_name, 
      a.subject_id, 
      s.name AS subject_name 
    FROM assignments a
    JOIN groups g ON a.group_id = g.id
    JOIN subjects s ON a.subject_id = s.id
    WHERE a.user_id = $1 AND a.is_active = true;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};


const getAssignmentById = async (id: number): Promise<Assignment | undefined> => {
  const query = `SELECT * FROM assignments WHERE id = $1 AND is_active = true;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const createAssignment = async (assignment: Assignment): Promise<Assignment> => {
  const query = `
    INSERT INTO assignments (user_id, group_id, subject_id, is_active)
    VALUES ($1, $2, $3, true)
    RETURNING *;
  `;
  const values = [assignment.user_id, assignment.group_id, assignment.subject_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateAssignment = async (id: number, assignment: Partial<Assignment>): Promise<Assignment | undefined> => {
  const query = `
    UPDATE assignments
    SET user_id = COALESCE($1, user_id),
        group_id = COALESCE($2, group_id),
        subject_id = COALESCE($3, subject_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND is_active = true
    RETURNING *;
  `;
  const values = [assignment.user_id, assignment.group_id, assignment.subject_id, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteAssignment = async (id: number): Promise<void> => {
  const query = `UPDATE assignments SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1;`;
  await pool.query(query, [id]);
};

export default {
  getAssignmentsByUserId,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};


// Archivo: attendanceModel.ts
import pool from "../config/db";

interface Attendance {
  id?: number;
  student_id: number;
  user_id: number;
  subject_id: number;
  date: string;
  status: "presente" | "ausente" | "retardo";
}

// Obtener lista de alumnos por grupo y materia
const getAttendanceByGroupAndSubject = async (groupId: number, subjectId: number) => {
  const query = `
    SELECT s.id AS student_id, s.matricula, s.name
    FROM students s
    WHERE s.group_id = $1
  `;
  const result = await pool.query(query, [groupId]);
  return result.rows.map((student) => ({
    ...student,
    status: "presente", // Todos inician como presentes por defecto
  }));
};

// Registrar múltiples asistencias en una sola consulta
const createAttendances = async (attendances: Attendance[]) => {
  if (attendances.length === 0) {
    throw new Error("No hay asistencias para registrar");
  }

  const query = `
    INSERT INTO attendances (student_id, user_id, subject_id, date, status)
    VALUES ${attendances.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
    RETURNING *;
  `;

  const values = attendances.flatMap(attendance => [
    attendance.student_id,
    attendance.user_id,
    attendance.subject_id,
    attendance.date,
    attendance.status.toLowerCase(),
  ]);

  const result = await pool.query(query, values);
  return result.rows;
};

export default {
  getAttendanceByGroupAndSubject,
  createAttendances,
};


// Archivo: gradeModel.ts
import pool from "../config/db";

interface Grade {
  id?: number;
  student_id: number;
  professor_id: number;
  subject_id: number;
  partial: number;
  activity_1?: number;
  activity_2?: number;
  attendance?: number;
  project?: number;
  exam?: number;
  is_active?: boolean;
}

// 🔹 Crear registros en la tabla grades cuando se inscribe un estudiante
const createGradesForStudent = async (studentId: number, groupId: number): Promise<void> => {
  try {
    const queryCheck = `
      SELECT COUNT(*) as count FROM grades g
      JOIN assignments a ON g.professor_id = a.user_id AND g.subject_id = a.subject_id
      WHERE g.student_id = $1 AND a.group_id = $2;
    `;

    const checkResult = await pool.query(queryCheck, [studentId, groupId]);
    const existingCount = parseInt(checkResult.rows[0].count);

    // Si ya existen 3 registros, no inserta nada
    if (existingCount >= 3) {
      console.log(`🔍 El estudiante ${studentId} ya tiene sus calificaciones registradas.`);
      return;
    }

    console.log(`✅ Creando calificaciones para el estudiante ${studentId}`);

    const queryInsert = `
      INSERT INTO grades (student_id, professor_id, subject_id, partial, activity_1, activity_2, attendance, project, exam, is_active)
      SELECT $1, a.user_id, a.subject_id, p.partial, 0, 0, 0, 0, 0, true
      FROM assignments a
      CROSS JOIN generate_series(1, 3) AS p(partial)
      WHERE a.group_id = $2
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(queryInsert, [studentId, groupId]);
  } catch (error) {
    console.error(`❌ Error al crear registros en grades para estudiante ${studentId}:`, error);
  }
};


// 🔹 Obtener calificaciones por grupo y materia
const getGradesByGroupAndSubject = async (groupId: number, subjectId: number, partial: number | null): Promise<Grade[]> => {
  console.log("🔹 Ejecutando consulta SQL con:", { groupId, subjectId, partial });

  const query = `
    SELECT g.id, s.matricula, s.name, g.partial, g.activity_1, g.activity_2, g.attendance, g.project, g.exam
    FROM grades g
    JOIN students s ON g.student_id = s.id
    WHERE s.group_id = $1 AND g.subject_id = $2
    ${partial ? "AND g.partial = $3" : ""}
    AND g.is_active = true
    ORDER BY s.name;
  `;

  const values = partial ? [groupId, subjectId, partial] : [groupId, subjectId];
  const result = await pool.query(query, values);
  
  console.log("📌 Resultados de la consulta:", result.rows);
  return result.rows;
};


// 🔹 Obtener calificaciones de todos los grupos y materias de un profesor
const getGradesByProfessor = async (professorId: number): Promise<Grade[]> => {
  const query = `
    SELECT g.id, s.matricula, s.name, g.partial, g.activity_1, g.activity_2, g.attendance, g.project, g.exam, a.group_id, a.subject_id
    FROM grades g
    JOIN students s ON g.student_id = s.id
    JOIN assignments a ON g.professor_id = a.user_id AND g.subject_id = a.subject_id
    WHERE g.professor_id = $1 AND g.is_active = true
    ORDER BY a.group_id, a.subject_id, s.name, g.partial;
  `;
  const result = await pool.query(query, [professorId]);
  return result.rows;
};

// 🔹 Actualizar una calificación específica
const updateGrade = async (id: number, updatedFields: Partial<Grade>): Promise<Grade | undefined> => {
  const query = `
    UPDATE grades
    SET 
      activity_1 = COALESCE($1, activity_1),
      activity_2 = COALESCE($2, activity_2),
      attendance = COALESCE($3, attendance),
      project = COALESCE($4, project),
      exam = COALESCE($5, exam),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND is_active = true
    RETURNING *;
  `;
  const values = [updatedFields.activity_1, updatedFields.activity_2, updatedFields.attendance, updatedFields.project, updatedFields.exam, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  createGradesForStudent,
  getGradesByGroupAndSubject,
  getGradesByProfessor,
  updateGrade,
};


// Archivo: groupModel.ts
import pool from "../config/db";

interface Group {
  id?: number;
  name: string;
  is_active?: boolean;
}

const getGroupByName = async (name: string): Promise<Group | undefined> => {
  const query = `SELECT * FROM groups WHERE name = $1;`;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

const getAllGroups = async (): Promise<Group[]> => {
  const query = `SELECT * FROM groups;`;
  const result = await pool.query(query);
  return result.rows;
};

const createGroup = async (name: string): Promise<Group> => {
  const query = `INSERT INTO groups (name) VALUES ($1) RETURNING *;`;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

export default {
  getGroupByName,
  getAllGroups,
  createGroup,
};


// Archivo: studentModel.ts
import pool from "../config/db";

interface Student {
  id?: number;
  name: string;
  email?: string;
  matricula: string;
  group_id: number;
  is_active?: boolean;
}

const getStudentByMatricula = async (matricula: string): Promise<Student | undefined> => {
  const query = `SELECT * FROM students WHERE matricula = $1;`;
  const result = await pool.query(query, [matricula]);
  return result.rows[0];
};

const getStudentsByGroup = async (groupId: number): Promise<Student[]> => {
  const query = `SELECT * FROM students WHERE group_id = $1;`;
  const result = await pool.query(query, [groupId]);
  return result.rows;
};

export default {
  getStudentByMatricula,
  getStudentsByGroup,
};


// Archivo: subjectModel.ts
import pool from "../config/db";

interface Subject {
  id?: number;
  name: string;
  is_active?: boolean;
}

const getSubjectById = async (id: number): Promise<Subject | undefined> => {
  const query = `SELECT * FROM subjects WHERE id = $1 AND is_active = true;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getSubjectByName = async (name: string): Promise<Subject | undefined> => {
  const query = `SELECT * FROM subjects WHERE name = $1 AND is_active = true;`;
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

const getAllSubjects = async (): Promise<Subject[]> => {
  const query = `SELECT * FROM subjects WHERE is_active = true;`;
  const result = await pool.query(query);
  return result.rows;
};

const createSubject = async (subject: Subject): Promise<Subject> => {
  const query = `INSERT INTO subjects (name, is_active) VALUES ($1, true) RETURNING *;`;
  const result = await pool.query(query, [subject.name]);
  return result.rows[0];
};

const updateSubject = async (id: number, name: string): Promise<Subject | undefined> => {
  const query = `
    UPDATE subjects
    SET name = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND is_active = true
    RETURNING *;
  `;
  const result = await pool.query(query, [name, id]);
  return result.rows[0];
};

const deleteSubject = async (id: number): Promise<void> => {
  const query = `UPDATE subjects SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1;`;
  await pool.query(query, [id]);
};

export default {
  getSubjectById,
  getSubjectByName,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};


// Archivo: userModel.ts
import pool from "../config/db";

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active?: boolean;
}

const getUsers = async (): Promise<User[]> => {
  const query = `SELECT * FROM users WHERE is_active = true;`;
  const result = await pool.query(query);
  return result.rows;
};

const getUsersByRole = async (role: string): Promise<User[]> => {
  const query = `SELECT * FROM users WHERE role = $1 AND is_active = true;`;
  const result = await pool.query(query, [role]);
  return result.rows;
};

const getUserById = async (id: number): Promise<User | undefined> => {
  const query = `SELECT * FROM users WHERE id = $1 AND is_active = true;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const createUser = async (user: User): Promise<User> => {
  const query = `
    INSERT INTO users (name, email, password, role, is_active)
    VALUES ($1, $2, $3, $4, true)
    RETURNING *;
  `;
  const result = await pool.query(query, [user.name, user.email, user.password, user.role]);
  return result.rows[0];
};

const updateUser = async (id: number, user: Partial<User>): Promise<User | undefined> => {
  const query = `
    UPDATE users
    SET name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        role = COALESCE($4, role),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND is_active = true
    RETURNING *;
  `;
  const values = [user.name, user.email, user.password, user.role, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteUser = async (id: number): Promise<void> => {
  const query = `UPDATE users SET is_active = false, deleted_at = CURRENT_TIMESTAMP WHERE id = $1;`;
  await pool.query(query, [id]);
};

export default {
  getUsers,
  getUsersByRole,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};



// ==== Directorio: routes ====

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



// ==== Directorio: utils ====

// Archivo: jwt.ts
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'clave_secreta';

// Generar un token
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

// Verificar un token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token inválido o expirado.');
  }
};


