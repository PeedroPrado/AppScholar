import { Request, Response }
  from "express";

import { NotaService }
  from "../services/NotaService";

export class NotaController {

  static async create(
    req: Request,
    res: Response
  ) {

    try {

      const nota =
        await NotaService.create(
          req.body
        );

      return res.status(201).json(
        nota
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        erro:
          "Erro ao cadastrar nota"
      });
    }
  }

  static async findAll(
    req: Request,
    res: Response
  ) {

    try {

      const notas =
        await NotaService.findAll(
          (req as any).user
        );

      return res.json(notas);

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        erro:
          "Erro ao buscar notas"
      });
    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        req.params.id as string;

      await NotaService.delete(id);

      return res.status(200).json({
        mensagem:
          "Nota removida"
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        erro:
          "Erro ao remover nota"
      });
    }
  }

  static async update(
  req: Request,
  res: Response
) {

  try {

    const id =
    req.params.id as string;

    const {
      nota1,
      nota2
    } = req.body;

    const nota =
      await NotaService.update(
        id,
        nota1,
        nota2
      );

    return res.json(nota);

  } catch (error: any) {

    return res.status(400).json({
      erro: error.message
    });
  }
}
}