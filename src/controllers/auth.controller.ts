import fetch from 'cross-fetch';
import bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { randomInt } from "crypto"

import prisma from '../prismaConnect'
import * as jwt from '../services/jwt.service'
import { cache } from '../cache';
import { validateMail, validatePassword } from "../helpers/validators";
import * as config from '../config';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ message: "Missing username, password or email" });
    }

    if (validatePassword(password) === false) return res.status(400).json({ message: "Password needs to be between 8-32 characters, have one lower and uppercase and one special character" });
    if (validateMail(email) === false)        return res.status(400).json({ message: "Email is not valid" });

    const userEmailCheck = await prisma.user.findFirst({ where: { email: email } });
    if (userEmailCheck) return res.status(400).json({ message: "User already exists" });

    // assign random id from swapi person ids pool to user fetch it's data and store in cache
    const swapiPersonId: number = randomInt(1,config.MAX_SWAPI_ID);
    const reponse = await fetch(`https://swapi.dev/api/people/${swapiPersonId}`)
    const data = await reponse.json();
    cache.set(`swapi:people:${swapiPersonId}`, JSON.stringify(data), {EX: config.EXPIRE_TIME});
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { password: passwordHash, email: email, swapi_id: swapiPersonId} })
    if (!user) return res.status(500).json({ message: "Internal server error" });
    return res.status(201).json({ message: "User created" });
}

export const login = async (req: Request, res: Response) => {
    const auth = async(password: string, user: User) => {
        if(!await bcrypt.compare(password, user.password)) { 
            return res.status(401).send({ message: 'Wrong password' });
        }
        const tokens = jwt.createTokens(user);
        res.status(200).send({ message: 'Logged in', tokens });
    }

    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send({ message: 'No username/email or password provided' })
    };

    prisma.user.findFirst({
        where: { email }
    }).then(async (user) => {
        if(!user) return res.status(404).send({ message: 'User not found' });
        auth(password, user);
    });
}

export const refreshToken = async (req: Request, res: Response) => {
    const headers = req.headers;
    if(typeof headers.authorization !== 'string' || req.headers === undefined) { 
        return res.status(400).send('Bad request');
    }

    const token = headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).send({ message: 'Missing token' });
    }
    
    const response = await jwt.refreshTokenService(token);

    if (response.hasOwnProperty('accessToken') && response.hasOwnProperty('refreshToken')) {
        res.status(200).send(response);
    }
    res.status(400).send({ message: 'Invalid token' });
}