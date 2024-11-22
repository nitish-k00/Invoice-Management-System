import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Input, InputNumber, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/SingleInvoice.css";
function Single_Invoice() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch invoice details
  const get_invoice_api = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://invoice-management-system-server.onrender.com/api/invoices/single_invoice/${id}`
      );
      setInvoice(data.invoices);
    } catch (error) {
      message.error("Error fetching invoice: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_invoice_api();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await axios.delete(`https://invoice-management-system-server.onrender.com/api/invoices/delete/${id}`);
      message.success("Invoice deleted successfully.");
      navigate("/");
    } catch (error) {
      message.error("Error deleting invoice: " + error.message);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Handle edit modal open
  const handleEdit = () => {
    form.setFieldsValue({
      invoice_number: invoice.invoice_number,
      customer_name: invoice.customer_name,
      date: invoice.date,
      details: invoice.details,
    });
    setIsModalVisible(true);
  };

  // Handle form submit
  const handleSubmit = async (invoiceData) => {
    setIsSubmitLoading(true);
    try {
      const updatedInvoiceData = {
        ...invoiceData,
        details: invoiceData.details.map((detail) => ({
          ...detail,
          _id: detail._id,
        })),
      };

      await axios.put("https://invoice-management-system-server.onrender.com/api/invoices/createUpdate", {
        invoiceData: updatedInvoiceData,
      });

      message.success("Invoice updated successfully.");
      setIsModalVisible(false);
      get_invoice_api();
    } catch (error) {
      message.error("Error updating invoice: " + error.message);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">No invoice found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 fade-in">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-primary text-center animate__animated animate__fadeIn">
            INVOICE DETAILS
          </h1>
          <hr />
          <div className="row mb-4">
            <div className="col-md-6">
              <h5>Customer Details</h5>
              <p>
                <strong>Name:</strong> {invoice.customer_name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>
            <div className="col-md-6 text-end">
              <h5>Invoice Info</h5>
              <p>
                <strong>Invoice Number:</strong> {invoice.invoice_number}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{invoice.total}
              </p>
            </div>
          </div>
          <h5>Products</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.details.map((item) => (
                  <tr key={item._id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unit_price}</td>
                    <td>₹{item.quantity * item.unit_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end">
            <h5>
              Grand Total: <strong>₹{invoice.total}</strong>
            </h5>
          </div>
        </div>
      </div>

      <div className="mt-3 mb-5 d-flex justify-content-center flex-column flex-sm-row">
        <Button
          type="primary"
          onClick={handleEdit}
          className="mb-2 mb-sm-0 animate__animated animate__fadeIn"
          disabled={isSubmitLoading}
        >
          Edit
        </Button>
        <Button
          type="primary"
          className="ms-sm-3 bg-danger animate__animated animate__fadeIn"
          onClick={handleDelete}
          loading={isDeleteLoading}
        >
          Delete
        </Button>
      </div>

      {/* Modal for Editing Invoice */}
      <Modal
        title="Edit Invoice"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            invoice_number: invoice.invoice_number,
            customer_name: invoice.customer_name,
            date: invoice.date,
            details: invoice.details,
          }}
        >
          <Form.Item label="Invoice Number" name="invoice_number">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Customer Name"
            name="customer_name"
            rules={[{ required: true, message: "Please enter customer name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <Input />
          </Form.Item>
          <Form.List
            name="details"
            initialValue={invoice.details}
            rules={[
              {
                validator: async (_, details) => {
                  if (!details || details.length < 1) {
                    return Promise.reject(new Error("At least one item"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Form.Item
                      {...restField}
                      label="Description"
                      name={[key, "description"]}
                      rules={[
                        { required: true, message: "Missing description" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Quantity"
                      name={[key, "quantity"]}
                      rules={[{ required: true, message: "Missing quantity" }]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Unit Price"
                      name={[key, "unit_price"]}
                      rules={[
                        { required: true, message: "Missing unit price" },
                      ]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <div className="text-end">
                      <Button
                        type="primary"
                        className="bg-danger"
                        onClick={() => remove(key)}
                        icon={<PlusOutlined />}
                      >
                        Remove Item
                      </Button>
                    </div>
                    <hr />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="primary"
                    className="bg-success"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <div className="text-center">
            <Button type="primary" htmlType="submit" loading={isSubmitLoading}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Single_Invoice;
