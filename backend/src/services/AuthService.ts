import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { pool }
  from "../database/db";

interface LoginDTO {

    email: string;

    senha: string;
}

export class AuthService {

    static async login({
        email,
        senha
    }: LoginDTO) {

        // busca usuário

        const result =
          await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE email = $1
            `,
            [email]
          );

        const usuario =
          result.rows[0];

        // usuário não encontrado

        if (!usuario) {

            throw new Error(
              "Email ou senha inválidos"
            );
        }

        // compara senha

        const senhaValida =
          await bcrypt.compare(
            senha,
            usuario.senha
          );

        if (!senhaValida) {

            throw new Error(
              "Email ou senha inválidos"
            );
        }

        // gera token

        const token = jwt.sign(

            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
            },

            process.env.JWT_SECRET as string,

            {
                expiresIn: "1d",
            }
        );

        return {

            token,

            usuario: {

                id: usuario.id,

                nome: usuario.nome,

                email: usuario.email,

                perfil: usuario.perfil,
            },
        };
    }
}