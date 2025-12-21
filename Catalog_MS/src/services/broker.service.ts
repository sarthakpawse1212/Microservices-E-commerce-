import {Consumer, Producer} from 'kafkajs';
import { CatalogService } from './catalog.service';
import { MessageBroker } from '../utils/broker';

export class BrokerService {
    private producer: Producer | null = null;
    private consumer: Consumer | null = null;

    private catalogService: CatalogService;

    constructor(catalogService: CatalogService){
        this.catalogService = catalogService
    }

    public async initializeBroker() {
        this.producer = await MessageBroker.connectProducer<Producer>();
        this.producer.on("producer.connect", async()=> {
            console.log("Catalog service producer connected successfully")
        })

        this.consumer = await MessageBroker.connectConsumer<Consumer>();
        this.consumer.on("consumer.connect", async() => {
            console.log("Catalog service consumer connected successfully")
        })

        // Keep listening to consumer events
        // Perform the action based on the event
        await MessageBroker.subscribe(this.catalogService.handleBrokerMessage.bind(this.catalogService), "CatalogEvents");
    }

    // Discontinue product events handle
    public async sendDeleteProductMessage(data: any){
        
    }
}