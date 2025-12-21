import express, { NextFunction, Request, Response } from 'express';
import { RequestAuthorizer } from './middleware';
import * as service from "../service/payment.service"
import { PaymentGateway, StripePayment } from '../utils';

const router = express.Router();
const paymentGateway : PaymentGateway= StripePayment;

router.post("/create-payment", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(!user){
        next(new Error("User not found"));
        return;
    }

    try {
        const {orderId} = req.body
    
        const response = await service.CreatePayment(user.id, orderId, paymentGateway)
        res.status(200).json({message: "Payment successfull", data: response})
    } catch (error) {
        next(error);
    }

})

router.get("/verify-payment/:id", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
     const user = req.user;
    if(!user){
        next(new Error("User not found"));
        return;
    }
    
    const paymentId = req.params.id;
    if(!paymentId){
        next(new Error("Payment ID not found"));
        return;
    }

    try {
        await service.VerifyPayment(paymentId, paymentGateway);
        res.status(200).json({message: "Payment verified"})
    } catch (error) {
        next(error);
    }

})

export default router;