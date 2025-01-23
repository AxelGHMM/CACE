import pool from "../config/db";

interface User {
  id?: number; // Campo opcional
  name: string;
  email: string;
  password: string;
  role: string;
}

const createUser = async (user: User): Promise<User> => {
  const { name, email, password, role } = user;

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [name, email, password, role];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUsers = async (): Promise<User[]> => {
  const query = `SELECT * FROM users;`;
  const result = await pool.query(query);
  return result.rows;
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Exportación por defecto
export default {
  createUser,
  getUserByEmail,
  getUserById,
  getUsers,
};
