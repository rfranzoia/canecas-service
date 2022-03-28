import {Product} from "../../domain/products/Product";
import BadRequestError from "../../utils/errors/BadRequestError";
import NotFoundError from "../../utils/errors/NotFoundError";
import InternalServerErrorError from "../../utils/errors/InternalServerErrorError";
import {productRepository} from "../../domain/products/ProductRepository";
import {productTypeRepository} from "../../domain/products/ProductTypeRepository";
import logger from "../../utils/Logger";

class ProductsService {

    async count() {
        return await productRepository.count();
    }

    async list() {
        return await productRepository.findAll();
    }

    async listByType(type: string) {
        return await productRepository.findByType(type);
    }

    async listByPriceRange(startPrice: number, endPrice: number) {
        startPrice = startPrice || 0;
        endPrice = endPrice || 999999;
        if (startPrice < 0 || endPrice < 0) {
            return new BadRequestError("Start an End prices must be greater than zero");
        }
        return await productRepository.findByPriceRange(startPrice, endPrice);
    }

    async findById(id: string) {
        const pt = await productRepository.findById(id);
        if (!pt) {
            return new NotFoundError(`No product found with ID ${id}`);
        }
        return pt;
    }

    async findByName(name: string) {
        const pt = await productRepository.findByName(name)
        if (!pt) {
            return new NotFoundError(`No product found with name ${name}`);
        }
        return pt;
    }

    async create(product: Product) {
        try {
            const p = await productRepository.findByName(product.name);
            if (p) {
                return new BadRequestError("Product with same name already exists");
            } else if (!await productTypeRepository.findByDescription(product.type)) {
                return new BadRequestError("Product Type doesnt't exists");
            }
            return await productRepository.create(product);
        } catch (error) {
            logger.error("Error while creating product", error.stack);
            return new InternalServerErrorError("Error while creating the product", error);
        }
    }

    async delete(id: string) {
        const product = await productRepository.findById(id);
        if (!product) {
            return new NotFoundError(`No product found with ID ${id}`);
        }
        const result = await productRepository.delete(id);
        if (result instanceof InternalServerErrorError) {
            return result;
        }
    }

    async update(id: string, product: Product) {
        const p = await productRepository.findById(id);
        if (!p) {
            return new NotFoundError(`No product found with ID ${id}`);
        }
        const p2 = await productRepository.findByName(product.name);
        if (!p2 || p2.id === id) {
            return await productRepository.update(id, product);
        }
        return new BadRequestError("Product already exists");

    }
}

export const productService = new ProductsService();