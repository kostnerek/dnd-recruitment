import jwt, { VerifyErrors } from 'jsonwebtoken';

import * as config from "../config"
import { User as IUser } from '@prisma/client'


export const createTokens = (user: IUser) => {
    const accessToken = jwt.sign({ id: user.id, email: user.email, swapi_id: user.swapi_id }, config.ACCESS_TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, email: user.email, swapi_id: user.swapi_id }, config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}


export const validateToken = (type: 'access'|'refresh', token: string) => {
    if (type==="access") {
        return jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err: VerifyErrors, decoded: jwt.JwtPayload) => {
            if (err) return false;
            return { username: decoded.username, email: decoded.email, grant: 0 };
        });
    }
    else if (type==="refresh") {
        return jwt.verify(token, config.REFRESH_TOKEN_SECRET, (err: VerifyErrors, decoded: jwt.JwtPayload) => {
            if (err) return false;
            return { username: decoded.username, email: decoded.email, grant: 1 };
        });
    }
    return false;
}

export const refreshTokenService = async (accessToken: string, refreshToken: string) => {
    if (!refreshToken && !accessToken) return  { message: "Missing token" };
    if (accessToken) {
        const user = validateToken("access", accessToken);
        if(user) {
            const tokens = createTokens(user);
            return {accessToken: tokens.accessToken, refreshToken: tokens.refreshToken};
        }
    }
    if (refreshToken) {
        const user = validateToken("refresh", refreshToken);
        if(user) {
            return {refreshToken: createTokens(user).refreshToken};
        }
    }
    return { message: "Invalid token" };
}