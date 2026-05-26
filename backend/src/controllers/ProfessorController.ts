import {Request, Response} from 'express';

import {ProfessorService} from '../services/ProfessorService';

export class ProfessorController {
    static async create(
        req: Request,
        res: Response
    ){
        try {
            const professor = await ProfessorService.create(req.body);

            return res.status(201).json(professor);

        } catch (error) {

        console.log(error);

        return res.status(500).json({
            erro:
            "Erro ao cadastrar professor"
        });
    }
}

    static async findAll(
        req: Request,
        res: Response
    ) {
        try {
            const professores = await ProfessorService.findAll();

            return res.json(professores)
        } catch (error) {

            console.log(error)

            return res.status(500).json({
                erro: "Erro ao buscar professores"
            });
        }
    }

    static async delete(
        req: Request,
        res: Response
    ) {
        try {
            const id = req.params.id as string;

            await ProfessorService.delete(id);

            return res.status(200).json({
                mensagem: "Professor removido com sucesso"
            });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            erro: "Erro ao remover professor"
        });
    }
  } 
}