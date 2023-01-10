import { User as IUser } from '@prisma/client';
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import { randomInt } from "crypto"

import prisma from '../prismaConnect'
import * as jwt from '../services/jwt.service'
import { validateMail, validatePassword } from "../helpers/validators";

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // if any of the fields are empty, return error
    if (!password || !email) {
        return res.status(400).json({ message: "Missing username, password or email" });
    }
    // console.log("Registering new user");
    // validate username, password and email if any of them is invalid, return error
    if (validatePassword(password) === false) return res.status(400).json({ message: "Password needs to be between 8-32 characters, have one lower and uppercase and one special character" });
    if (validateMail(email) === false)        return res.status(400).json({ message: "Email is not valid" });

    // check if user with the same username or email already exists, if so return error
    // db.Users.findUserByEmail
    const userEmailCheck = await prisma.user.findFirst({ where: { email: email } })
    
    if (userEmailCheck) return res.status(400).json({ message: "User already exists" });

    // save user to the database

    const passwordHash = await bcrypt.hash(password, 10);

    const swapiPersonId: number = randomInt(1,84)

    const user = await prisma.user.create({ data: { password: passwordHash, email: email, swapi_id: swapiPersonId} })
    if (!user) return res.status(500).json({ message: "Internal server error" });
    return res.status(201).json({ message: "User created" });
}

export const login = async (req: Request, res: Response) => {
    const auth = async(password: string, user:IUser) => {
        console.log(password, user.password);
        if(!await bcrypt.compare(password, user.password)) return res.status(400).send({ message: 'Wrong password' });
        const tokens = jwt.createTokens(user);
        res.status(200).send({ message: 'Logged in', tokens });
    }


    const { email, password } = req.body;
    if(!email || !password) return res.status(400).send({ message: 'No username/email or password provided' });
    prisma.user.findFirst({
        where: { email }
    }).then(async (user) => {
        if(!user) return res.status(400).send({ message: 'User not found' });
        auth(password, user)
    });
}