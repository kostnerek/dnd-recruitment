export {};
import { User } from '@prisma/client'
declare global {
    namespace Express {
        interface Request {
            id?: number;
            email?: string;
            swapi_id?: number;
        }
    }
    export interface IJwt extends User {
        type?: string;
    }
}