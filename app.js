const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./config/db");

const customerRoutes = require("./routes/customers");
const loanRoutes = require("./routes/loans");

app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/customers", customerRoutes);
app.use("/api/loans", loanRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
