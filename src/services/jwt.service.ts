import jwt from 'jsonwebtoken';

import * as config from "../config"


export const createTokens = (user: jwt.JwtPayload) => {
    const accessToken  = jwt.sign({ id: user.id, swapi_id: user.swapi_id, type: 'accessToken' }, config.TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, swapi_id: user.swapi_id, type: 'refreshToken'}, config.TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}


export const validateToken = (token: string): jwt.JwtPayload | string | boolean => {
    try {
        const decoded = jwt.verify(token, config.TOKEN_SECRET);
        return decoded;
    } catch {
        return false;
    }
}

export const refreshTokenService = async (token: string) => {
    if (!token) return  { message: "Missing token" };
    const decodedToken = validateToken(token);
    if(typeof decodedToken !== 'boolean' && typeof decodedToken !== "string") {
        const tokens = createTokens(decodedToken);
        if(decodedToken.type === 'accessToken') return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        return { refreshToken: tokens.refreshToken };
    }
    return { message: "Invalid token" };
}