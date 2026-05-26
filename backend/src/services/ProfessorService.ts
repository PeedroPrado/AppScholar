import { pool } from "../database/db";

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
    ){
        const query = `
        INSERT INTO professores (
        nome,
        titulacao,
        area,
        tempo_docencia,
        email
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `;

        const values = [
            data.nome,
            data.titulacao,
            data.area,
            data.tempoDocencia,
            data.email,
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }
    
    static async findAll(){
        const result = await pool.query(`
            SELECT *
            FROM professores
            ORDER BY id DESC
            `);

            return result.rows;
    }

    static async delete(id: string){
        await pool.query(`
            DELETE FROM professores
            WHERE id = $1
            `, [id]);
    }
}