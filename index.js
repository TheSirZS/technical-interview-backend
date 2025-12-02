const express = require("express");
const productRouter = require("./src/routes/product.route");

const app = express();

app.use(express.json());

app.use(productRouter);

const PORT = 3001;
app.listen(PORT, () =>
  console.log("Backend running in http://localhost:" + PORT)
);
