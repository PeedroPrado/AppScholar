import { Request, Response } from "express";
import { AlunoService } from "../services/AlunoService";

export class AlunoController {

  static async create(req: Request, res: Response) {

    try {

      const aluno = await AlunoService.create(req.body);

      return res.status(201).json(aluno);

    } catch (error) {

      return res.status(500).json({
        erro: "Erro ao cadastrar aluno",
      });

    }
  }

  static async findAll(req: Request, res: Response) {

    try {

      const alunos = await AlunoService.findAll();

      return res.json(alunos);

    } catch (error) {

      return res.status(500).json({
        erro: "Erro ao buscar alunos",
      });

    }
  }
}