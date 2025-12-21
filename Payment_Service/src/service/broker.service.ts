import { Producer } from "kafkajs"
import { MessageBroker } from "../utils"
import { PaymentEvent } from "../types";

// Initilize the broker
export const InitializeBroker = async () => {
    const producer = await MessageBroker.connectProducer<Producer>();
    producer.on("producer.connect", async()=> {
        console.log("Order service producer connected successfully")
    })
}


// Publish dedicated events based on use cases 
export const SendPaymentUpdateMessage = async (data: any) => {
    await MessageBroker.publish({
        event: PaymentEvent.UPDATE_PAYMENT,
        topic: "OrderEvents",
        headers: {},
        message: {
            data
        }
    });
}