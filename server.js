import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/db/db.js";
import routes from './src/routes/index.js'
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

(async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})();

app.use("/api", routes);