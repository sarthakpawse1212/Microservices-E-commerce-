import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { ProductFactory } from "../../utils/fixtures";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";

const mockProduct = (rest?: any) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    stock: faker.number.int({ min: 10, max: 100 }),
    ...rest,
  };
};

describe("Catalog service", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });

  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe("Create Product", () => {
    test("Should create product", async () => {
      let service = new CatalogService(repository);
      let reqBody = mockProduct();
      let result = await service.createProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("Should throw error with Unable to create product", async () => {
      let service = new CatalogService(repository);
      let reqBody = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() => Promise.resolve({} as Product));

      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Unable to create product"
      );
    });

    test("Should throw error with Product already exists", async () => {
      let service = new CatalogService(repository);
      let reqBody = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product already exists"))
        );

      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Product already exists"
      );
    });
  });

  describe("updateProduct", () => {
    test("should update product", async () => {
      let service = new CatalogService(repository);
      let reqBody = mockProduct({
        id: faker.number.int({ min: 10, max: 1000 }),
      });
      let result = await service.updateProduct(reqBody);
      expect(result).toMatchObject(reqBody);
    });

    test("Should throw error with Product does not exists", async () => {
      let service = new CatalogService(repository);

      jest
        .spyOn(repository, "update")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product does not exists"))
        );

      await expect(service.updateProduct({})).rejects.toThrow(
        "Product does not exists"
      );
    });
  });

  describe("getProducts", () => {
    test("should get products by offset and limit", async () => {
      let service = new CatalogService(repository);
      const randomLimit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(randomLimit);
      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() => Promise.resolve(products));
      const result = await service.getProducts(randomLimit, 0, '');
      expect(result.length).toEqual(randomLimit);
      expect(result).toMatchObject(products);
    });

    test("Should throw error with Products does not exists", async () => {
      let service = new CatalogService(repository);

      jest
        .spyOn(repository, "find")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Products does not exists"))
        );

      await expect(service.getProducts(0, 0, '')).rejects.toThrow(
        "Products does not exists"
      );
    });
  });

  describe("getProduct", () => {
    test("should get product by id", async () => {
      let service = new CatalogService(repository);
      const product = ProductFactory.build();
      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() => Promise.resolve(product));
      const result = await service.getProduct(product.id!);
      expect(result).toMatchObject(product);
    });

    test("Should throw error with Product does not exists in database", async () => {
      let service = new CatalogService(repository);

      jest
        .spyOn(repository, "findOne")
        .mockImplementationOnce(() =>
          Promise.reject(new Error("Product does not exists in database"))
        );

      await expect(service.getProduct(0)).rejects.toThrow(
        "Product does not exists in database"
      );
    });
  });

  describe("deleteProduct", () => {
    test("should delete product by id", async () => {
      let service = new CatalogService(repository);
      const product = ProductFactory.build();
      jest
        .spyOn(repository, "delete")
        .mockImplementationOnce(() => Promise.resolve({ id: product.id }));
      const result = await service.deleteProduct(product.id!);
      expect(result).toMatchObject({
        id: product.id,
      });
    });

    test("should throw error with Deletion not happened because product does not exists ", async () => {
      let service = new CatalogService(repository);
      jest
        .spyOn(repository, "delete")
        .mockImplementationOnce(() =>
          Promise.reject(
            new Error("Deletion not happened because product does not exists")
          )
        );
      await expect(service.deleteProduct(0)).rejects.toThrow(
        "Deletion not happened because product does not exists"
      );
    });
  });
});
