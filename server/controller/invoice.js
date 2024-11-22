const invoice_Detail_Model = require("../models/invoiceDeatils");
const invoice_Model = require("../models/invoice");
const { total } = require("../midware/invoive");

const create_update = async (req, res) => {
  const { invoice_number, customer_name, date, details } = req.body.invoiceData;

  try {
    const existing_Invoice = await invoice_Model.findOne({ invoice_number });

    if (existing_Invoice) {
      existing_Invoice.customer_name = customer_name;
      existing_Invoice.date = date;
      existing_Invoice.total = total(details);
      await existing_Invoice.save();

      // updateing details

      for (const data of details) {
        const existing_Invoice_Details = await invoice_Detail_Model.findById(
          data._id
        );

        if (existing_Invoice_Details) {
          existing_Invoice_Details.description = data.description;
          existing_Invoice_Details.quantity = data.quantity;
          existing_Invoice_Details.unit_price = data.unit_price;
          existing_Invoice_Details.line_total = data.quantity * data.unit_price;
          await existing_Invoice_Details.save();
        } else {
          const new_Invoice_Detail = await new invoice_Detail_Model({
            description: data.description,
            quantity: data.quantity,
            unit_price: data.unit_price,
            line_total: data.quantity * data.unit_price,
            invoice: existing_Invoice._id,
          }).save();

          existing_Invoice.details.push(new_Invoice_Detail._id);
          await existing_Invoice.save();
        }
      }
      res.status(200).json("Existing invoice updated successfully.");
    } else {
      const new_Invoice = await invoice_Model({
        invoice_number,
        customer_name,
        date,
        total: total(details),
      });
      await new_Invoice.save();

      for (const data of details) {
        const new_Invoice_Detail = await new invoice_Detail_Model({
          description: data.description,
          quantity: data.quantity,
          unit_price: data.unit_price,
          invoice: new_Invoice._id,
        });
        await new_Invoice_Detail.save();
        new_Invoice.details.push(new_Invoice_Detail._id);
      }
      await new_Invoice.save();
      res
        .status(200)
        .json({ message: "New invoice created successfully.", new_Invoice });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const delete_inVoice = async (req, res) => {
  const invoice_id = req.params.id;

  try {
    const existing_Invoice = await invoice_Model.findByIdAndDelete(invoice_id);

    const existing_Invoice_Details = await invoice_Detail_Model.deleteMany({
      invoice: invoice_id,
    });

    if (existing_Invoice && existing_Invoice_Details) {
      res.status(200).json("Invoice and its details deleted successfully.");
    } else {
      res.status(404).json("Invoice not found.");
    }
  } catch (error) {
    res.status(500).json("An error occurred while deleting the invoice.");
  }
};

const get_invoice = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    if (page < 1) {
      return res
        .status(400)
        .json({ message: "Page must be greater than or equal to 1" });
    }

    const invoices = await invoice_Model
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total_Document = await invoice_Model.countDocuments();

    const total_Page = Math.ceil(total_Document / limit);

    res.status(200).json({ data: invoices, total_Page });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching invoices." });
  }
};

const get_invoice_single = async (req, res) => {
  const invoice_id = req.params.id;
  try {
    const invoices = await invoice_Model
      .findById(invoice_id)
      .populate("details");

    res.status(200).json({ invoices });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching invoices." });
  }
};

module.exports = {
  create_update,
  delete_inVoice,
  get_invoice,
  get_invoice_single,
};
