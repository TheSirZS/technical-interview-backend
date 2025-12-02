const { products } = require("../data/products");
const { hasParams } = require("../utils/validations");

const getProducts = (req, res) => {
  const query = req.query;
  if (!hasParams(query)) {
    res.status(200).send({
      products,
    });
  } else {
    const { name } = query;
    const results = products.filter((product) =>
      product.name.toLowerCase().startsWith(name.toLowerCase())
    );
    res.status(200).send({
      products: results,
    });
  }
};

const createReview = (req, res) => {
  const body = req.body;
  const params = req.params;
  if (!hasParams(params)) {
    res.status(403).send({ message: "Operation Not Allowed" });
  } else {
    const id = params.id;
    const product = products.find((product) => product.id === id);
    if (!product) {
      res.status(404).send({ message: "Product Not Found" });
    } else {
      if (!body || !hasParams(body)) {
        return res.status(403).send({
          message:
            "Operation Not Allowed: (Body is required to complete this operation)",
        });
      } else {
        const { comment, rating, reviewer } = body;
        if (!comment) {
          return res.status(403).send({
            message:
              "Operation Not Allowed: (Comment is required to complete this operation)",
          });
        }
        if (rating <= 0 || rating > 5) {
          return res.status(403).send({
            message:
              "Operation Not Allowed: (Rating should be between 1 and 5)",
          });
        }
        const results = products.map((product) => {
          if (product.id === id) {
            product.reviews.push({ reviewer, rating, comment });
            return product;
          }
          return product;
        });
        res.status(201).send({
          message: "Review successfully added",
          products: results,
        });
      }
    }
  }

  const id = params.id;
};

module.exports = {
  getProducts,
  createReview,
};
