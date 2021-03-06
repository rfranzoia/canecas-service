import { Router } from "express";
import { ProductVariationController } from "../controller/ProductVariationController";
import { TokenService } from "../security/TokenService";

const productVariationController = new ProductVariationController();
const productVariationRouter = Router();

const tokenService = TokenService.getInstance();

productVariationRouter.get("/", productVariationController.list);
productVariationRouter.get("/count", productVariationController.count);
productVariationRouter.get("/filterBy", productVariationController.listByFilter);
productVariationRouter.get("/:id", productVariationController.get);

productVariationRouter.post("/", tokenService.authenticateToken, productVariationController.create);
productVariationRouter.delete("/:id", tokenService.authenticateToken, productVariationController.delete);
productVariationRouter.put("/:id", tokenService.authenticateToken, productVariationController.update);

export default productVariationRouter;