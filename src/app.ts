import * as types from './types/index.d'
import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import authRoutes from './routes/auth.route';
import resourceRoutes from './routes/resources.route';
dotenv.config()

const app: Express = express();
const port: string = process.env.PORT || "3000";
app.use("/api-docs", swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('<:remote-addr> :remote-user |:method :url - :status| :user-agent :response-time ms [:date[iso]]'));
}
app.use('/auth', authRoutes);
app.use('/resource', resourceRoutes);


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});