const { Router } = require("express");
const {
  getProducts,
  createReview,
} = require("../controllers/product.controller");

const productRouter = Router();

productRouter.get("/products", getProducts);
productRouter.post("/products/:id/reviews", createReview);

module.exports = productRouter;
