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



