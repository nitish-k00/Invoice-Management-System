import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "antd";
import CreateForm from "./CreateForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function Invoice() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [originalInvoices, setOriginalInvoices] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const get_all_invoice_api = async (page) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/invoices/get?page=${page}`
      );
      setInvoices(data.data);
      setOriginalInvoices(data.data);
      setTotalPage(data.total_Page);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_all_invoice_api(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    const filteredInvoices = originalInvoices.filter((invoice) => {
      const matchesName = invoice.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate =
        (!startDate || new Date(invoice.date) >= new Date(startDate)) &&
        (!endDate || new Date(invoice.date) <= new Date(endDate));
      return matchesName && matchesDate;
    });
    setInvoices(filteredInvoices);
  };

  const onclick_get_id = (id) => {
    navigate(`/singleInvoice/${id}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setInvoices(originalInvoices);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    get_all_invoice_api(currentPage); // Refresh invoices after modal is closed
  };

  return (
    <div className="container mt-4">
      {/* Title Row */}
      <div className="row">
        <div className="col text-center">
          <h1 className="display-4 text-uppercase text-primary">Invoices</h1>
          <p className="text-muted">Browse all invoices with ease</p>
        </div>
      </div>

      {/* Create, Search, and Date Filter Row */}
      <div className="row mt-4 g-3">
        <div className="col-md-3">
          <button
            className="btn btn-success w-100"
            onClick={() => setIsModalVisible(true)}
          >
            Create Invoice
          </button>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
          <button
            className="btn btn-outline-secondary w-100 mt-2"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="row mt-4">
          <div className="col text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Fetching invoices...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Invoice Cards */}
          <div className="row mt-4 g-3">
            {invoices.map((data) => (
              <div
                key={data.invoice_number}
                className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center"
                onClick={() => onclick_get_id(data._id)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card shadow-sm"
                  style={{
                    borderRadius: "15px",
                    width: "100%",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div className="card-body text-center">
                    <h5 className="card-title text-primary">
                      {data.invoice_number}
                    </h5>
                    <p className="card-text text-truncate">
                      <strong>Customer:</strong> {data.customer_name}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong>{" "}
                      {new Date(data.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>Total:</strong> ₹{data.total}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Row */}
          <div className="row mt-5">
            <div className="col d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  {Array.from(
                    { length: totalPage },
                    (_, index) => index + 1
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        page === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <Modal
              title="Create New Invoice"
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
            >
              <CreateForm onSubmit={handleModalClose} />
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}

export default Invoice;
