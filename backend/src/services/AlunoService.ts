import { pool } from "../database/db";

interface CreateAlunoDTO {
    nome: string;
    matricula: string;
    curso: string;
    email: string;
    telefone: string;
    cep: string;
    endereco: string;
    cidade: string;
    estado: string;
}

export class AlunoService {
    static async create(data: CreateAlunoDTO) {
       const query = `
        INSERT INTO alunos (
        nome,
        matricula,
        curso,
        email,
        telefone,
        cep,
        endereco,
        cidade,
        estado
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `;
      
      const values = [
        data.nome,
        data.matricula,
        data.curso,
        data.email,
        data.telefone,
        data.cep,
        data.endereco,
        data.cidade,
        data.estado
      ];

      const result = await pool.query(query, values);

      return result.rows[0]
    }

    static async findAll(){

        const result = await pool.query(`
            SELECT * FROM alunos
            ORDER BY id DESC
            `);

        return result.rows;
    }

    static async delete(id: string){
        await pool.query(
            `DELETE FROM alunos
            WHERE id = $1
            `,
            [id]
        );
    }
}

