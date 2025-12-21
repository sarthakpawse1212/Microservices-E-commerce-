import { log } from "console";
import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { OrderWithLineItems } from "../types/message.type";
import { AppEventListener } from "../utils/AppEventListener";
import { ElasticSearchService } from "./elasticSearch.service";

export class CatalogService {

    private _repository: ICatalogRepository;

    constructor(repository: ICatalogRepository){
        this._repository = repository;
    }

    async createProduct(input: any) {
        const data = await this._repository.create(input);
        if(!data.id){
            throw new Error("Unable to create product");
        }

        AppEventListener.instance.notify({
            event: "createProduct",
            data
        });

        return data;
    }

    async updateProduct(input: any) {
        const data = await this._repository.update(input);
        if(!data){
            throw new Error("Unable to update product");
        }
        // emit event to update record in Elastic search

        AppEventListener.instance.notify({
            event: "updateProduct",
            data
        });

        return data;
    }

    //instead of this we will get products from Elastic search
    async getProducts(limit: number, offset: number, search: string){

        const elkService = new ElasticSearchService();
        const products = await elkService.searchProduct(search);
        console.log("Products:", products);
        //const products = await this._repository.find(limit, offset)
        return products;
    }

    async getProduct(id: number){
        const product = await this._repository.findOne(id);
        return product;
    }

    async deleteProduct(id: number){
        const response = await this._repository.delete(id);

        if(!response) {
            throw new Error("Unable to delete product");
        }
        //delete record from elastic search

        AppEventListener.instance.notify({
            event: "deleteProduct",
            data: {id}
        });

        return response;
    }

    async getProductStock(ids: number[]){
        const products = await this._repository.findStock(ids);
        if(!products){
            throw new Error("Unable to find product details")
        }
        return products;
    }

    async handleBrokerMessage(message : any){
        console.log("Catalog service recieved message", message);
        const orderData = message.data as OrderWithLineItems;
        const {orderItems} = orderData;
        orderItems.forEach(async (item)=> {
            console.log("updating stock for product", item.productId, item.qty);
            // perform stock update operation
            const product = await this.getProduct(item.productId);
            if(!product){
                console.log("Product not found during stock update for create order event", item.productId);
            }
            else {
                // update stock
                const updatedStock = product.stock - item.qty;
                await this.updateProduct({...product, stock: updatedStock});
            }
        })
    }
}