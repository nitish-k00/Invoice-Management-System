import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function CreateForm({
  setInvoices,
  setOriginalInvoices,
  invoices,
  originalInvoices,
  setIsModalVisible,
}) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState([
    { description: "", quantity: 1, unit_price: "" },
  ]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newDetails = [...details];

    if (name === "quantity" || name === "unit_price") {
      const numericValue = parseFloat(value);
      newDetails[index][name] = numericValue >= 0 ? numericValue : 0;
    } else {
      newDetails[index][name] = value;
    }

    setDetails(newDetails);
  };

  const handleAddDetail = () => {
    setDetails([...details, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveDetail = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_name: customerName,
      date,
      details,
    };

    try {
      setLoading(true);
      const { data } = await axios.put(
        "https://invoice-management-system-server.onrender.com/api/invoices/createUpdate",
        {
          invoiceData,
        }
      );

      if (data.new_Invoice) {
        setInvoices([...invoices, data.new_Invoice]);
        setOriginalInvoices([...originalInvoices, data.new_Invoice]);
      }

      setCustomerName("");
      setInvoiceNumber("");
      setDate("");
      setDetails([{ description: "", quantity: 1, unit_price: "" }]);

      setIsModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error("Error creating invoice:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">CREATE INVOICES</h1>

      <form onSubmit={handleSubmit}>
        {/* Invoice Number */}
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            type="text"
            className="form-control"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            required
          />
        </div>

        {/* Customer Name */}
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Invoice Details */}
        <h4 className="mt-4">Invoice Details</h4>
        {details.map((detail, index) => (
          <div key={index} className="card mt-2">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor={`description-${index}`}>Description</label>
                <input
                  type="text"
                  className="form-control"
                  id={`description-${index}`}
                  name="description"
                  value={detail.description}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`quantity-${index}`}>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id={`quantity-${index}`}
                  name="quantity"
                  value={detail.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`unit_price-${index}`}>Unit Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  id={`unit_price-${index}`}
                  name="unit_price"
                  value={detail.unit_price}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                  min="0"
                />
              </div>

              {/* Remove button for details */}
              {details.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger mt-2"
                  onClick={() => handleRemoveDetail(index)}
                >
                  Remove Detail
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Detail Button */}
        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={handleAddDetail}
        >
          Add Detail
        </button>

        {/* Submit Button */}
        <div className="form-group mt-4">
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating...
              </>
            ) : (
              "Create Invoice"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateForm;
