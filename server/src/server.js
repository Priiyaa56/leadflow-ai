const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const config = require("./config");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", routes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, () => {
  console.log(`LeadFlow AI API running on http://localhost:${config.port}`);
});
