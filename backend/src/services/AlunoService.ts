import { pool } from "../database/db";
import bcrypt from "bcrypt";

interface CreateAlunoDTO {

    nome: string;
    matricula: string;
    curso: string;
    semestre: number;

    email: string;
    telefone: string;

    cep: string;
    endereco: string;

    cidade: string;
    estado: string;
}

export class AlunoService {

    static async create(
      data: CreateAlunoDTO
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
            "student"
          ]
        );

      // pega id do usuário criado

      const usuarioId =
        usuarioResult.rows[0].id;

      // cria aluno

      const query = `
        INSERT INTO alunos (

          usuario_id,

          nome,
          matricula,
          curso,
          semestre,
          email,
          telefone,
          cep,
          endereco,
          cidade,
          estado

        )
        VALUES (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10,$11
        )
        RETURNING *
      `;

      const values = [

        usuarioId,

        data.nome,
        data.matricula,
        data.curso,
        data.semestre,
        data.email,
        data.telefone,
        data.cep,
        data.endereco,
        data.cidade,
        data.estado
      ];

      const result =
        await pool.query(
          query,
          values
        );

      return result.rows[0];
    }

    static async findAll(user: any) {

  // PROFESSOR

  if (user.perfil === "teacher") {

  const result =
    await pool.query(`

      SELECT DISTINCT

        alunos.*

      FROM alunos

      INNER JOIN disciplinas
        ON disciplinas.semestre = alunos.semestre

      INNER JOIN professores
        ON professores.id = disciplinas.professor_id

      WHERE professores.usuario_id = $1

      ORDER BY alunos.nome ASC

    `, [user.id]);

  return result.rows;
}

  // ADMIN

  const result =
    await pool.query(`

      SELECT

  id,

  nome,

  matricula,

  curso,

  semestre,

  email

FROM alunos

ORDER BY nome ASC

    `);

  return result.rows;
}

    static async delete(
      id: string
    ) {

        await pool.query(
            `
            DELETE FROM alunos
            WHERE id = $1
            `,
            [id]
        );
    }
}