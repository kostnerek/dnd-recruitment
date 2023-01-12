import jwt from 'jsonwebtoken';
import * as config from "../config"

export const createTokens = (user: jwt.JwtPayload) => {
    const accessToken  = jwt.sign({ id: user.id, swapi_id: user.swapi_id, type: 'accessToken' }, config.TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, swapi_id: user.swapi_id, type: 'refreshToken'}, config.TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}

export const refreshTokenService = async (token: string) => {
    const decodedToken = jwt.decode(token);
    if(decodedToken instanceof Object) {
        const tokens = createTokens(decodedToken);
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }
    return {}
}