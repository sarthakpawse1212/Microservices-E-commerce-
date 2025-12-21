import { GetOrderDetails } from  '../utils/broker/api'
import { PaymentGateway } from '../utils/payment/payment.type';
import { SendPaymentUpdateMessage } from './broker.service';

export const CreatePayment = async(userId: number, orderNumber: number, paymentGateway: PaymentGateway) => {

    // get order details
    const order = await GetOrderDetails(orderNumber);
    if(order.customerId !== userId) {
        throw new Error("user not authorised to create payment")
    }

    // create a new payment record 
    const amountInCents = order.amount * 100;
    const orderMetaData = {
        orderNumber: order.orderNumber,
        userId: userId
    }

    // call payment gateway to create payment
    const paymentResponse = await paymentGateway.createPayment(amountInCents, orderMetaData);
    console.log(paymentResponse)

    // returm payment secret
    //Amount has to be fetched from order service 
    return {
        secret: paymentResponse.secret,
        pubKey: paymentResponse.pubKey,
        amount: amountInCents,
        order: order // for testing
    }
}

export const VerifyPayment = async(paymentId: string, paymentGateway: PaymentGateway) => {
    // call payment gateway to verify payment
    const paymentResponse = await paymentGateway.getPayment(paymentId);
    console.log("PaymentStatus", paymentResponse.status);
    console.log("paymentLog", paymentResponse.paymentLog);

    // update order status through message broker
    const response = await SendPaymentUpdateMessage({
        orderNumber: paymentResponse.orderNumber,
        status: paymentResponse.status,
        paymentLog: paymentResponse.paymentLog
    })

    console.log("Message broker response", response)

    // return payment status <= not neccessary just fpr res to frontend
    return {
        message: "Payment verified",
        status: paymentResponse.status,
        paymentLog: paymentResponse.paymentLog
    }
    
}