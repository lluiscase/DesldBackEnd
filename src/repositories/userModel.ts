import connection from "../database/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userAdapter, UserProfileResponse } from "../adapters/userAdapter";

const JWT_SECRET = process.env.JWT_SECRET || 'auhelp_super_secret_jwt_key_2026';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  phone_number?: string;
  avatarUrl?: string;
  avatar_url?: string;
  active?: boolean;
}

class UserModel {
  getAll(): Promise<UserProfileResponse[]> {
    const sql = "SELECT * FROM users WHERE active = TRUE";
    return new Promise((resolve, reject) => {
      connection.query(sql, (error: any, results: any) => {
        if (error) {
          return reject(error);
        }
        resolve(results.map((row: any) => userAdapter(row)));
      });
    });
  }

  getId(id: number): Promise<UserProfileResponse | null> {
    const sql = "SELECT * FROM users WHERE id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [id], (error: any, results: any) => {
        if (error) {
          return reject(error);
        }
        if (!results || results.length === 0) {
          return resolve(null);
        }
        resolve(userAdapter(results[0]));
      });
    });
  }

  getByEmail(email: string): Promise<any> {
    const sql = "SELECT * FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [email], (error: any, results: any) => {
        if (error) {
          return reject(error);
        }
        resolve(results && results.length > 0 ? results[0] : null);
      });
    });
  }

  create(user: CreateUserInput): Promise<{ user: UserProfileResponse; token: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user.name || !user.email || !user.password) {
          return reject(new Error("Nome, email e senha são obrigatórios"));
        }

        const existing = await this.getByEmail(user.email);
        if (existing) {
          return reject(new Error("Este endereço de email já está cadastrado"));
        }

        const hash = await bcrypt.hash(user.password, 10);
        const newUserRecord = {
          name: user.name.trim(),
          email: user.email.trim().toLowerCase(),
          password: hash,
          phone_number: user.phone || user.phone_number || null,
          avatar_url: user.avatarUrl || user.avatar_url || null,
          active: true
        };

        const sql = "INSERT INTO users SET ?";
        connection.query(sql, newUserRecord, async (error: any, results: any) => {
          if (error) {
            return reject(error);
          }

          const createdId = results.insertId;
          const createdUser = await this.getId(createdId);

          const token = jwt.sign(
            { id: createdId, email: newUserRecord.email },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          resolve({
            user: createdUser!,
            token
          });
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }

  update(userUpdated: Partial<CreateUserInput>, id: number): Promise<UserProfileResponse | null> {
    const fieldsToUpdate: any = {};
    if (userUpdated.name) fieldsToUpdate.name = userUpdated.name.trim();
    if (userUpdated.phone || userUpdated.phone_number) {
      fieldsToUpdate.phone_number = userUpdated.phone || userUpdated.phone_number;
    }
    if (userUpdated.avatarUrl || userUpdated.avatar_url) {
      fieldsToUpdate.avatar_url = userUpdated.avatarUrl || userUpdated.avatar_url;
    }

    const sql = "UPDATE users SET ? WHERE id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [fieldsToUpdate, id], async (error: any) => {
        if (error) {
          return reject(error);
        }
        const updated = await this.getId(id);
        resolve(updated);
      });
    });
  }

  delete(id: number): Promise<{ message: string }> {
    const sql = "DELETE FROM users WHERE id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [id], (error: any) => {
        if (error) {
          return reject(error);
        }
        resolve({ message: "Usuário deletado com sucesso" });
      });
    });
  }
}

export default new UserModel();
