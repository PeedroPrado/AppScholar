import {Request, Response} from 'express';
import {DisciplinaService} from '../services/DisciplinaService';

export class DisciplinaController {
    static async create(
        req: Request,
        res: Response
    ){
        try {

            const disciplina = await DisciplinaService.create(req.body);

            return res.status(201).json(
                disciplina
            );
        } catch (error){
            console.log(error);
            return res.status(500).json({
                erro: "Erro ao cadastrar disciplina"
            });
        }
    }

    static async findAll(
  req: Request,
  res: Response
) {
  try {

    const disciplina =
      await DisciplinaService.findAll(
        (req as any).user
      );

    return res.json(disciplina);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      erro: "Erro ao buscar as disciplinas"
    });
  }
}
    static async delete(
        req: Request,
        res: Response
    ) {
        try {
            const id = req.params.id as string; 
            await DisciplinaService.delete(id);

            return res.status(200).json({
                mensagem: "Disciplina deletada com sucesso"
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                erro: "Erro ao deletar disciplina"
            });
        }
    }
}