import dotenv from 'dotenv'
dotenv.config()

export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : ''
export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET : ''
export const ACCESS_TOKEN_EXPIRATION: string = process.env.ACCESS_TOKEN_EXPIRATION ? process.env.ACCESS_TOKEN_EXPIRATION : ''
export const REFRESH_TOKEN_EXPIRATION: string = process.env.REFRESH_TOKEN_EXPIRATION ? process.env.REFRESH_TOKEN_EXPIRATION : ''


