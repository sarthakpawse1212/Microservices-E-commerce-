
import * as Repository from '../../repository/cart.repository'
import { CartRepositoryType } from '../../repository/cart.repository'
import {CreateCart} from '../../service/cart.service'

describe("cartService", ()=> {
    let repo: CartRepositoryType

    beforeEach(()=> {
        repo = Repository.CartRepository;
    })

    afterEach(()=> {
        repo = {} as CartRepositoryType;
    })

    test("should return correct data while creating cart", async () =>{
        const mockCart: any = {
            title: "smart phone",
            amount: 1200
        }

        // jest.spyOn(Repository.CartRepository, "create")
        // .mockImplementationOnce(()=> Promise.resolve({
        //     message: "fake cart created!!", 
        //     input: mockCart
        // }))

        const res = await CreateCart(mockCart, repo);
        expect(res).toEqual({
            message: "fake cart created!!", 
            input: mockCart
        })
    })
})