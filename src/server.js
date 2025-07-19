import raqRouter from "./raq.route.js";
import express from "express";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/api", raqRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
