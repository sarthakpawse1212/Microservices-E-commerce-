import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import orderRoutes from './routes/order.routes'
import cartRoutes from './routes/cart.routes'
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

    app.use(cors())

    app.use(express.json());
    app.use(httpLogger);

    await InitializeBroker();

    app.use(cartRoutes);
    app.use(orderRoutes);

    app.use('/', (req: Request, res: Response, _: NextFunction)=> {
        return res.status(200).json({message: "I am healthy"})
    })

    app.use(HandleErrorWithLogger);

    return app;
}