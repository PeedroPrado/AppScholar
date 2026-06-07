import { pool } from "../database/db";
import bcrypt from "bcrypt";

interface CreateProfessorDTO {

    nome: string;
    titulacao: string;

    area: string;

    tempoDocencia: string;

    email: string;
}

export class ProfessorService {

    static async create(
        data: CreateProfessorDTO
    ) {

        // cria senha padrão

        const senhaHash =
          await bcrypt.hash(
            "123456",
            10
          );

        // cria usuário

        const usuarioResult =
          await pool.query(
            `
            INSERT INTO usuarios (
              nome,
              email,
              senha,
              perfil
            )
            VALUES ($1,$2,$3,$4)
            RETURNING id
            `,
            [
              data.nome,
              data.email,
              senhaHash,
              "teacher"
            ]
          );

        // pega id do usuário

        const usuarioId =
          usuarioResult.rows[0].id;

        // cria professor

        const query = `
        INSERT INTO professores (

          usuario_id,

          nome,
          titulacao,
          area,
          tempo_docencia,
          email

        )
        VALUES (
          $1,$2,$3,$4,$5,$6
        )
        RETURNING *
        `;

        const values = [

            usuarioId,

            data.nome,
            data.titulacao,
            data.area,
            data.tempoDocencia,
            data.email,
        ];

        const result =
          await pool.query(
            query,
            values
          );

        return result.rows[0];
    }

    static async findAll() {

  const result = await pool.query(`

    SELECT

      id,

      nome,

      titulacao,

      area,

      tempo_docencia,

      email

    FROM professores

    ORDER BY nome ASC

  `);

  return result.rows;
}

    static async delete(
      id: string
    ) {

        await pool.query(
          `
          DELETE FROM professores
          WHERE id = $1
          `,
          [id]
        );
    }
}