const express = require("express");
const cors = require("cors");
require("dotenv").config();             
const routes = require("./routes");

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
