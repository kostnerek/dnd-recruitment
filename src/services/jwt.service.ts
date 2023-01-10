import jwt from 'jsonwebtoken';
import * as config from "../config"



export const createTokens = (user: IJwt) => {
    const accessToken  = jwt.sign({ id: user.id, swapi_id: user.swapi_id, type: 'accessToken' }, config.TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, swapi_id: user.swapi_id, type: 'refreshToken'}, config.TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}


export const validateToken = (token: string) => {
    const decoded = jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
        if (err) return;
        if (decoded) return decoded;
    });
    return decoded as unknown as IJwt;
}


export const refreshTokenService = async (token: string) => {
    const decodedToken = validateToken(token);
    if(decodedToken instanceof Object) {
        const tokens = createTokens(decodedToken);
        return { refreshToken: tokens.refreshToken };
    }
    return {}
}