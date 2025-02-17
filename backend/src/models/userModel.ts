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
