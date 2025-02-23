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


