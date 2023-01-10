import { validateToken } from '../services/jwt.service.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';

interface IVerifyTokenRequest extends Request {
    id: number | undefined;
    email: string | undefined;
    swapi_id: number | undefined;
}

/**
 * Middleware which intercepts headers sent to the server, 
 * checks if an access token or refresh token is present, validates them,
 * and if they are valid, it adds the user object to the request object
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.Next} next
 */
export const verifyToken = (req: IVerifyTokenRequest, res: Response, next: NextFunction) => {
    // if(req.cookies.access_token || req.cookies.refresh_token) return res.status(403).send({ message: 'Both tokens provided!' });
    const token = req.headers.authorization?.split(' ')[1];
    
    let validatedToken;
    if (token) validatedToken = validateToken(token);
    
    if (typeof validatedToken === 'object' ) {
        req.id = validatedToken.id;
        req.email = validatedToken.email;
        req.swapi_id = validatedToken.swap_id;
        next();
    } else {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
}