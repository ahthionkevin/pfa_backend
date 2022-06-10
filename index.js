const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");
const cartRoute = require("./routes/cart.route");
const orderRoute = require("./routes/order.route");
const stripeRoute = require("./routes/stripe.route");
const eventRouter = require("./routes/event.route");

const cors = require("cors");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/events", eventRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Backend server is running! on port " + port);
});
