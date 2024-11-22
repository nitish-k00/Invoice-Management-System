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
    { description: "", quantity: 1, unit_price: 0 },
  ]);
  const [errors, setErrors] = useState({}); 
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

  const validateForm = () => {
    const newErrors = {};

    // Validate invoice number
    if (!invoiceNumber) {
      newErrors.invoiceNumber = "Invoice number is required.";
    }

    // Validate customer name
    if (!customerName) {
      newErrors.customerName = "Customer name is required.";
    }

    // Validate date
    if (!date) {
      newErrors.date = "Date is required.";
    }

    // Validate details (quantity and unit price should be greater than 1 and numbers)
    details.forEach((detail, index) => {
      if (detail.quantity <= 0 || isNaN(detail.quantity)) {
        newErrors[`quantity-${index}`] =
          "Quantity must be greater than 0 and a valid number.";
      }
      if (detail.unit_price <= 0 || isNaN(detail.unit_price)) {
        newErrors[`unit_price-${index}`] =
          "Unit price must be greater than 0 and a valid number.";
      }
      if (!detail.description) {
        newErrors[`description-${index}`] = "Description is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const invoiceData = {
      invoice_number: invoiceNumber,
      customer_name: customerName,
      date,
      details,
    };

    try {
      setLoading(true);
      const { data } = await axios.put(
        "http://localhost:8000/api/invoices/createUpdate",
        {
          invoiceData,
        }
      );

      setInvoices([...invoices, data.new_Invoice]);
      setOriginalInvoices([...originalInvoices, data.new_Invoice]);
      setIsModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error("Error creating invoice:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary">CREATE I</h1>

      <form onSubmit={handleSubmit}>
        {/* Invoice Number */}
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            type="text"
            className={`form-control ${
              errors.invoiceNumber ? "is-invalid" : ""
            }`}
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            required
          />
          {errors.invoiceNumber && (
            <div className="invalid-feedback">{errors.invoiceNumber}</div>
          )}
        </div>

        {/* Customer Name */}
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            className={`form-control ${
              errors.customerName ? "is-invalid" : ""
            }`}
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          {errors.customerName && (
            <div className="invalid-feedback">{errors.customerName}</div>
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className={`form-control ${errors.date ? "is-invalid" : ""}`}
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {errors.date && <div className="invalid-feedback">{errors.date}</div>}
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
                  className={`form-control ${
                    errors[`description-${index}`] ? "is-invalid" : ""
                  }`}
                  id={`description-${index}`}
                  name="description"
                  value={detail.description}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
                {errors[`description-${index}`] && (
                  <div className="invalid-feedback">
                    {errors[`description-${index}`]}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`quantity-${index}`}>Quantity</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors[`quantity-${index}`] ? "is-invalid" : ""
                  }`}
                  id={`quantity-${index}`}
                  name="quantity"
                  value={detail.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                  min="1"
                />
                {errors[`quantity-${index}`] && (
                  <div className="invalid-feedback">
                    {errors[`quantity-${index}`]}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`unit_price-${index}`}>Unit Price (₹)</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors[`unit_price-${index}`] ? "is-invalid" : ""
                  }`}
                  id={`unit_price-${index}`}
                  name="unit_price"
                  value={detail.unit_price}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                  min="0"
                />
                {errors[`unit_price-${index}`] && (
                  <div className="invalid-feedback">
                    {errors[`unit_price-${index}`]}
                  </div>
                )}
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
