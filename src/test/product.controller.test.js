const { describe, expect, test } = require("@jest/globals");

const {
  getProducts,
  createReview,
} = require("../controllers/product.controller");
const { products } = require("../data/products");
const { hasParams } = require("../utils/validations");

jest.mock("../data/products", () => ({
  products: [
    { id: "1", name: "Phone", reviews: [] },
    { id: "2", name: "Laptop", reviews: [] },
  ],
}));

jest.mock("../utils/validations", () => ({
  hasParams: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (data = {}) => ({
  query: data.query || {},
  body: data.body || {},
  params: data.params || {},
});

describe("getProducts", () => {
  test("Should return all products where there is not query params", () => {
    hasParams.mockReturnValue(false);

    const req = mockRequest({ query: {} });
    const res = mockResponse();

    getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      products: products,
    });
  });

  test("Should filter products by name", () => {
    hasParams.mockReturnValue(true);

    const req = mockRequest({ query: { name: "ph" } });
    const res = mockResponse();

    getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      products: [{ id: "1", name: "Phone", reviews: [] }],
    });
  });
});

describe("createReview", () => {
  test("Should return 403 if params is empty", () => {
    hasParams.mockReturnValue(false);

    const req = mockRequest({ params: {} });
    const res = mockResponse();

    createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ message: "Operation Not Allowed" });
  });

  test("Should return 404 if product does not exist", () => {
    hasParams.mockReturnValue(true);

    const req = mockRequest({ params: { id: "999" } });
    const res = mockResponse();

    createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "Product Not Found" });
  });

  test("Should return 403 if body is empty", () => {
    hasParams.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const req = mockRequest({
      params: { id: "1" },
      body: {},
    });
    const res = mockResponse();

    createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message:
        "Operation Not Allowed: (Body is required to complete this operation)",
    });
  });

  test("Should return 403 if there is not comment", () => {
    hasParams.mockReturnValue(true);

    const req = mockRequest({
      params: { id: "1" },
      body: { reviewer: "Diego", rating: 5 },
    });
    const res = mockResponse();

    createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message:
        "Operation Not Allowed: (Comment is required to complete this operation)",
    });
  });

  test("Should return 403 if rating is not valid", () => {
    hasParams.mockReturnValue(true);

    const req = mockRequest({
      params: { id: "1" },
      body: { reviewer: "Diego", comment: "Nice!", rating: 0 },
    });
    const res = mockResponse();

    createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message: "Operation Not Allowed: (Rating should be between 1 and 5)",
    });
  });

  test("Should add new successfully review", () => {
    hasParams.mockReturnValue(true);

    const req = mockRequest({
      params: { id: "1" },
      body: { reviewer: "Diego", comment: "Great!", rating: 5 },
    });
    const res = mockResponse();

    createReview(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Review successfully added",
      })
    );
  });
});
