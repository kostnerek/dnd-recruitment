import { Request, Response, NextFunction } from 'express';
import * as jwt from '../services/jwt.service';

interface IRefreshTokenRequest extends Request {
    refreshToken: string;
}

export const refreshToken = async (req: IRefreshTokenRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Missing token' });
    const response = await jwt.refreshTokenService(token);
    if (response?.refreshToken) {
        req.refreshToken = response.refreshToken
        next();
    };
    return res.status(401).send({ message: 'Invalid token' })
}