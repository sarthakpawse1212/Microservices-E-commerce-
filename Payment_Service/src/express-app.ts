import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import paymentRoutes from './routes/payment.routes';
import { HandleErrorWithLogger, httpLogger } from './utils';
import { InitializeBroker } from './service/broker.service';

export const ExpressApp = async () => {
    const app = express();

    // here cors() means it accepts any cross origin request (*)

    // If we cant to configure it then use 
    // app.use(cors({
    // origin: 'http://localhost:3000',  // allow only this frontend
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // credentials: true   // this allow us to accept cookies (* not allowed when credentials : true)
    // }))

    app.use(cors({ origin : "*"}));

    app.use(express.json());
    app.use(httpLogger);

    await InitializeBroker();

    app.use(paymentRoutes);

    app.use('/', (req: Request, res: Response, _: NextFunction)=> {
        return res.status(200).json({message: "I am healthy"})
    })

    app.use(HandleErrorWithLogger);

    return app;
}