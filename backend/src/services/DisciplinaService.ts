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

static async findAll(){
    const result = await pool.query(`
        SELECT *
        FROM disciplinas
        ORDER BY id DESC
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