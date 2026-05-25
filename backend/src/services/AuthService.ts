import jwt from "jsonwebtoken";

interface LoginDTO {
    email: string,
    senha: string,
}

export class AuthService {
    static async login ({ email, senha }: LoginDTO) {

    if(
        email !== "admin@email.com" || 
        senha !== "123456"
    ) {
        throw new Error ("Email ou senha inválidos");
    }

    const usuario = {
        id: 1,
        nome: "Administrador",
        email, 
        perfil:"admin",
    };

    const token = jwt.sign(
        usuario,
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1d",
        }
    );

    return {
        token,
        usuario,
        };
    }
}