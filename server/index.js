if (process.env.NODE_ENV !== "production") {
  const dns = require("node:dns");
  dns.setServers(["1.1.1.1"]);
}

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const customerRoutes = require("./routes/customer.routes");

const app = express();
const Port = 8085;

dotenv.config();

dbUrl = process.env.dbUrl;

app.use(express.json());
app.use(cookieParser());

app.use("/customers", customerRoutes);

async function startServer() {
  try {
    await mongoose.connect(dbUrl);

    console.log("DB Connection OK");

    app.listen(Port, () => {
      console.log(`Server Started on port: ${Port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
