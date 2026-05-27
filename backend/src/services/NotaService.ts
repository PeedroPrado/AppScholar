import { pool } from "../database/db";

interface CreateNotaDTO {

  alunoId: number;

  disciplinaId: number;

  nota1: number;

  nota2: number;
}

export class NotaService {

  static async create(
    data: CreateNotaDTO
  ) {

    const media =
      (data.nota1 + data.nota2) / 2;

    const status =
      media >= 6
        ? "Aprovado"
        : "Reprovado";

    const query = `
      INSERT INTO notas (
        aluno_id,
        disciplina_id,
        nota1,
        nota2,
        media,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `;

    const values = [
      data.alunoId,
      data.disciplinaId,
      data.nota1,
      data.nota2,
      media,
      status,
    ];

    const result =
      await pool.query(query, values);

    return result.rows[0];
  }

  static async findAll() {

    const result = await pool.query(`
      SELECT
        notas.id,

        alunos.nome AS aluno,

        disciplinas.nome AS disciplina,

        notas.nota1,
        notas.nota2,
        notas.media,
        notas.status

      FROM notas

      INNER JOIN alunos
        ON alunos.id = notas.aluno_id

      INNER JOIN disciplinas
        ON disciplinas.id = notas.disciplina_id

      ORDER BY notas.id DESC
    `);

    return result.rows;
  }

  static async delete(id: string) {

    await pool.query(
      `
      DELETE FROM notas
      WHERE id = $1
      `,
      [id]
    );
  }
}