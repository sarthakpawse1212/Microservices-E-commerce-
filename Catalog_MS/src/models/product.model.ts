export class Product {
    constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly description: string,
        public readonly stock: number,
        public readonly id?: number,
    ){

    }
}