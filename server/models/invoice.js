const mongoose = require("mongoose");

const InvoiceSchema = mongoose.Schema({
  invoice_number: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  date: { type: Date, required: true },
  total: { type: Number, default: 0 },
  details: [{ type: mongoose.Types.ObjectId, ref: "invoiceDetail" }],
});

const InvoiceModel = mongoose.model("invoice", InvoiceSchema);

module.exports = InvoiceModel;
