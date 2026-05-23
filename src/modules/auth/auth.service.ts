import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../db/index.js";
import config from "../../config/index.js";
import type { ILogin, ISignup } from "./auth.interface.js";

// register a new user
const signupUserIntoDB = async (payload: ISignup) => {
  const { name, email, password, role } = payload;

  // check if email already exists
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role]
  );

  return result.rows[0];
};

// login user
const loginUserIntoDB = async (payload: ILogin) => {
  const { email, password } = payload;

  // check if user exists
  const userData = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = userData.rows[0];

  // compare the password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  // generate jwt token — include id, name, role for permission checks later
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwtSecretKey, { expiresIn: "1d" });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};
