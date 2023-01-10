import * as types from './types/index.d'
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from "body-parser";

import authRoutes from './routes/auth.route';
import resourceRoutes from './routes/resources.route';


dotenv.config({ path: './.env' })
const app: Express = express();
const port: string = process.env.PORT || "3000";


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('<:remote-addr> :remote-user |:method :url - :status| :user-agent :response-time ms [:date[iso]]'));
}

app.use('/auth', authRoutes);
app.use('/resource', resourceRoutes);

app.get("/", (req: Request, res: Response) => {
    res.status(200).send({message: "Hello World!"});
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


export default app; // for testing purposes 