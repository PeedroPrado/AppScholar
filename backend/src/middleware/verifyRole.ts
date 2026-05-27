import {
  Request,
  Response,
  NextFunction
}
from "express";

export function verifyRole(
  roles: string[]
) {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const user =
      (req as any).user;

    if (
      !user ||
      !roles.includes(user.perfil)
    ) {

      return res.status(403).json({
        erro: "Sem permissão",
      });
    }

    next();
  };
}