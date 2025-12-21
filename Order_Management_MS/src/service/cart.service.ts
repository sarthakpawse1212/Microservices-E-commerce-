import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartReqeust.dto";
import { CartRepositoryType } from "../repository/cart.repository"
import { logger, NotFoundError , AuthorizeError} from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";

export const CreateCart = async (input: CartRequestInput & {customerId: number}, repo: CartRepositoryType) => {

    // Get product details from catalog service
    const product: any = await GetProductDetails(input.productId);
    logger.info(product);
    if(product.stock < input.quantity){
        throw new NotFoundError("Product is out of stock")
    }
    
    // Find if product already in the cart

    const lineItem = await repo.findCartByProductId(input.customerId, input.productId);
    if(lineItem){
        return repo.updateCart(input.productId, lineItem.qty + input.quantity)
    }
    return await repo.createCart(input.customerId, {
        productId: product.id,
        price: product.price.toString(),
        qty: input.quantity,
        itemName: product.name,
        variant: product.variant
    } as CartLineItem);
}

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  // get customer cart data
  const cart = await repo.findCart(id);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  // list out all line items in the cart
  const lineItems = cart.lineItems;

  if (!lineItems.length) {
    throw new NotFoundError("cart items not found");
  }

  // verify with inventory service if the product is still available
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails)) {
    // update stock availability in cart line items
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItem.productId
      );
      if (stockItem) {
        lineItem.availability = stockItem.stock;
      }
    });

    // update cart line items
    cart.lineItems = lineItems;
  }

  // return updated cart data with latest stock availability
  return cart;
};

export const EditCart = async (input: CartEditRequestInput & {customerId: number}, repo: CartRepositoryType) => {
    await AuthorisedCart(input.id, input.customerId, repo);
    const data = await repo.updateCart(input.id, input.quantity);
    return data;
}

export const DeleteCart = async (input: {id: number, customerId: number}, repo: CartRepositoryType) => {
    await AuthorisedCart(input.id, input.customerId, repo);
    const data = await repo.deleteCart(input.id);
    return data;
}

const AuthorisedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizeError("you are not authorized to edit this cart");
  }

  return lineItem;
};