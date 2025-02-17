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
