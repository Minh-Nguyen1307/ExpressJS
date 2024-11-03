import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

import { customers, orders, products } from "./dat.js";

app.get("/customers", (req, res) => {
  res.send(customers);
});

app.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  const customer = customers.find((i) => i.id === id);
  if (customer) {
    res.send(customer);
  } else {
    res.status(404).send({ error: "Customer not found" });
  }
});

app.get("/customers/:customerId/orders", (req, res) => {
  const { customerId } = req.params;
  const customerOrder = orders.filter((o) => o.customerId === customerId);
  if (customerOrder) {
    res.send(customerOrder);
  } else {
    res.status(404).send({ error: "Orders not found" });
  }
});

app.get("/orders/highvalue", (req, res) => {
  const ordersHighvalue = orders.filter((p) => p.totalPrice > 10000000);
  if (ordersHighvalue.length > 0) {
    res.send(ordersHighvalue);
  } else {
    res.status(404).send({ error: "Orders not found" });
  }
});

app.get("/products", (req, res) => {
  const queryParams = req.query;
  const minPrice = queryParams.minPrice || 0;
  const maxPrice = queryParams.maxPrice || Infinity;
  const filterProducts = products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
  res.send(filterProducts);
});

app.post("/customers", (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) {
    return res
      .status(400)
      .send({ message: "Name, email, and age are required" });
  }
  const emailExists = customers.some((customer) => customer.email === email);
  if (emailExists) {
    return res.status(400).send({ message: "Email already exists!" });
  }
  const id = crypto.randomUUID();
  const newCustomer = { id, name, email, age };
  customers.push(newCustomer);

  res.status(201).send(newCustomer);
});

app.get("/orders", (req, res) => {
  console.log("GET /orders requested");
  res.status(200).send(orders);
});

app.post("/orders", (req, res) => {
  const { orderId, customerId, productId, quantity } = req.body;
  if (!orderId || !customerId || !productId || !quantity) {
    return res
      .status(400)
      .send({
        message: "OrderId, customerId, productId, and quantity are required.",
      });
  }
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).send({ message: "Product not found." });
  }
  if (quantity <= 0 || quantity > product.quantity) {
    return res.status(400).send({ message: "Invalid quantity." });
  }
  const totalPrice = product.price * quantity;
  const newOrder = {
    orderId,
    customerId,
    productId,
    quantity,
    totalPrice,
  };
  orders.push(newOrder);
  product.quantity -= quantity;
  res.status(201).send(newOrder);
});
app.get("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const order = orders.find((o) => o.orderId === orderId);
  if (order) {
    res.send(order);
  } else {
    sendError(res, 404, "Order not found");
  }
});
app.put("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).send({ message: "Quantity >= 0." });
  }
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) {
    return res.status(404).send({ message: "Order not found." });
  }
  const product = products.find((p) => p.id === order.productId);
  if (!product) {
    return res.status(404).send({ message: "Product not found." });
  }
  const updatedQuantity = quantity - order.quantity;
  if (product.quantity < updatedQuantity) {
    return res.status(400).send({ message: "Product quantity not enough." });
  }
  product.quantity -= updatedQuantity;
  order.quantity = quantity;
  order.totalPrice = order.quantity * product.price;

  res.status(200).send(order);
});

app.get("*", (req, res) => {
  res.send("Not support!");
});
app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;

  const customerIndex = customers.findIndex((customer) => customer.id === id);

  if (customerIndex === -1) {
    return res.status(404).send({ message: "Customer not found." });
  }

  customers.splice(customerIndex, 1);

  res.status(200).send({ message: "Customer deleted successfully." });
});
app.listen(8080, () => {
  console.log("Server is running!");
});
