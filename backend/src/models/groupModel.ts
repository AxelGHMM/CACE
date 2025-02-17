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
