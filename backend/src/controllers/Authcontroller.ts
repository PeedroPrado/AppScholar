import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
    static async login(req: Request, res: Response){
        try{
            const {email, senha} = req.body;

            const response = await AuthService.login({
                email,
                senha,
            });

            return res.json(response);
        } catch (error: any){

            return res.status(401).json({
                erro: error.message,
            });
        }
    }
}