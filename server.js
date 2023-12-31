import express from "express";
import cors from "cors";
import mysql from "mysql2";
import { Sequelize } from "sequelize";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const sequelize = new Sequelize("assignment1", "root", "1998@Pupss", {
  host: "localhost",
  dialect: "mysql",
});

// Middleware to set cache-control header to 'no-cache'
app.use("/healthz", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Length", "0");

  // if (req.method !== "GET" || req.headers["content-length"] !== "1") {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }
  if (
    Object.keys(req.query).length !== 0 ||
    Object.keys(req.body).length !== 0
  ) {
    return res.status(400).send("Bad Request");
  }
  next();
});

app.get("/healthz", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  try {
    const isDatabaseConnected = await checkDatabaseConnection();
    console.log("is", isDatabaseConnected);

    if (isDatabaseConnected) {
      res.status(200).end(); // to ensure no payload is sent
    } else {
      res.status(503).end(); // HTTP 503 Service Unavailable
    }
  } catch (error) {
    console.error("Error in health check:", error);
    res.status(503).end(); // Handle any errors as service unavailable and to ensure no payload is sent
  }
});

async function checkDatabaseConnection() {
  return new Promise(async (resolve, reject) => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      resolve(true);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      reject(error);
    }
  });
}

const port = 9000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

