const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
dotenv.config();

app.use(express.json());
app.use(cors());

const invoiceRoutes = require("./routes/invoice");

app.use("/api/invoices", invoiceRoutes);

mongoose
  .connect(process.env.MOONGOSE_URI)
  .then(() => console.log("connected to DB"))
  .catch((error) => console.log(error));

// Server listening
app.listen(PORT, () => console.log("server connected to ", { PORT }));
