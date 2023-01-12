import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token===undefined) return res.status(401).send({ message: 'Unauthorized!' });

    let validatedToken = jwt.decode(token) as jwt.JwtPayload & {id: number, email: string, swapi_id: number, type: string};
    if (validatedToken?.hasOwnProperty('id') && validatedToken.type === 'accessToken') {
        req.id = validatedToken.id;
        req.email = validatedToken.email;
        req.swapi_id = validatedToken.swapi_id;
        next();
    } else {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
}