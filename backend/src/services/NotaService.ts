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

    const alunoResult =
  await pool.query(
    `
    SELECT semestre
    FROM alunos
    WHERE id = $1
    `,
    [data.alunoId]
  );

    const disciplinaResult =
      await pool.query(
        `
    SELECT semestre
    FROM disciplinas
    WHERE id = $1
    `,
        [data.disciplinaId]
      );

    const alunoSemestre =
      alunoResult.rows[0]?.semestre;

    const disciplinaSemestre =
      disciplinaResult.rows[0]?.semestre;

    if (
      Number(alunoSemestre) !==
      Number(disciplinaSemestre)
    ) {

      throw new Error(
        "Aluno e disciplina pertencem a semestres diferentes"
      );
    }
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

    const columns = await pool.query(`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'notas'
`);

    const result =
      await pool.query(query, values);

    return result.rows[0];
  }

  static async findAll(user: any) {

  // ALUNO

  if (user.perfil === "student") {

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

      WHERE alunos.usuario_id = $1

      ORDER BY notas.id DESC

    `, [user.id]);

    return result.rows;
  }

  // PROFESSOR

  if (user.perfil === "teacher") {

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

      INNER JOIN professores
        ON professores.id = disciplinas.professor_id

      WHERE professores.usuario_id = $1

      ORDER BY notas.id DESC

    `, [user.id]);

    return result.rows;
  }

  // ADMIN → vê tudo

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