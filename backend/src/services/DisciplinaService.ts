import { pool } from '../database/db';

interface CreateDisciplinaDTO {
    nome: string;
    cargaHoraria: number;
    professorId: string;
    curso: string;
    semestre: number;
}

export class DisciplinaService {
    static async create(
        data: CreateDisciplinaDTO
    ){
        const query = `
        INSERT INTO disciplinas (
        nome,
        carga_horaria,
        professor_id,
        curso,
        semestre
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `;

    const values = [
        data.nome,
        data.cargaHoraria,
        data.professorId,
        data.curso,
        data.semestre,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
    }

static async findAll(user: any) {

  // ALUNO

  if (user.perfil === "student") {

    const result = await pool.query(`

      SELECT

        disciplinas.id,

        disciplinas.nome,

        disciplinas.curso,

        disciplinas.semestre,

        disciplinas.carga_horaria AS "cargaHoraria",

        professores.nome AS "professor"

      FROM disciplinas

      INNER JOIN alunos
        ON alunos.usuario_id = $1

      LEFT JOIN professores
        ON professores.id = disciplinas.professor_id

      WHERE disciplinas.semestre = alunos.semestre

      ORDER BY disciplinas.nome ASC

    `, [user.id]);

    return result.rows;
  }

  // PROFESSOR

  if (user.perfil === "teacher") {

    const result = await pool.query(`

      SELECT

        disciplinas.id,

        disciplinas.nome,

        disciplinas.curso,

        disciplinas.semestre,

        disciplinas.carga_horaria AS "cargaHoraria",

        professores.nome AS "professor"

      FROM disciplinas

      INNER JOIN professores
        ON professores.id = disciplinas.professor_id

      WHERE professores.usuario_id = $1

      ORDER BY disciplinas.nome ASC

    `, [user.id]);

    return result.rows;
  }

  // ADMIN

  const result = await pool.query(`

    SELECT

      disciplinas.id,

      disciplinas.nome,

      disciplinas.curso,

      disciplinas.semestre,

      disciplinas.carga_horaria AS "cargaHoraria",

      professores.nome AS "professor"

    FROM disciplinas

    LEFT JOIN professores
      ON professores.id = disciplinas.professor_id

    ORDER BY disciplinas.nome ASC

  `);

  return result.rows;
}

static async delete(id: string){
    await pool.query(`
        DELETE FROM disciplinas
        WHERE id = $1
        `, [id]);
}
}