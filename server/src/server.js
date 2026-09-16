const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "LeadFlow AI API is running" });
});

app.use("/api", routes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
if (require.main === module) {
  app.listen(5000, () => {
    console.log("LeadFlow AI API running on http://localhost:5000");
  });
}