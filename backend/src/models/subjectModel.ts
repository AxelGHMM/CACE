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
