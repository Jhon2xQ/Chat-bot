import raqRouter from "./raq.route.js";
import express from "express";
import cors from "cors";

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", raqRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
