const express = require("express");
const route = express.Router();

const {
  create_update,
  delete_inVoice,
  get_invoice,
  get_invoice_single,
} = require("../controller/invoice");

route.put("/createUpdate", create_update);
route.delete("/delete/:id", delete_inVoice);
route.get("/get", get_invoice);
route.get("/single_invoice/:id", get_invoice_single);

module.exports = route;
