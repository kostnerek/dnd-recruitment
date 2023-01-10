import { validateToken } from '../services/jwt.service';
import { Request, Response, NextFunction } from 'express';
/**
 * Middleware which intercepts headers sent to the server, 
 * checks if an access token or refresh token is present, validates them,
 * and if they are valid, it adds the user object to the request object
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.Next} next
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token===undefined) return res.status(401).send({ message: 'Unauthorized!' });

    let validatedToken = validateToken(token) as unknown as IJwt;
    if (validatedToken.hasOwnProperty('id')) {
        req.id = validatedToken.id;
        req.email = validatedToken.email;
        req.swapi_id = validatedToken.swapi_id;
        next();
    } else {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
}