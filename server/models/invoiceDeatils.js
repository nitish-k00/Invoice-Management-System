const mongoose = require("mongoose");

const InvoiceDetailSchema = mongoose.Schema({
  invoice: { type: mongoose.Types.ObjectId, ref: "invoice" },
  description: { type: String },
  quantity: { type: Number, min: 1 },
  unit_price: { type: Number, min: 0 },
  line_total: {
    type: Number,
    default: function () {
      return this.quantity * this.unit_price;
    },
  },
});

const InvoiceDetailModel = mongoose.model("invoiceDetail", InvoiceDetailSchema);

module.exports = InvoiceDetailModel;
