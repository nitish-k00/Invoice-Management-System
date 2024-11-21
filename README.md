# Full-Stack Invoice Management System

This project implements a full-stack invoice management system with MERN REST Framework for the backend and React for the frontend. The system allows creating, managing, and deleting invoices with multiple line items through a single API endpoint. It includes essential features such as pagination, search, and form validation.

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting Up Environment Variables](#setting-up-environment-variables)
- [Usage](#usage)


## Features

- **Invoice Management:** Create, update, view, and delete invoices.
- **Pagination:** API supports pagination for invoice listings.
- **Search and Filter:** Basic search and filter functionality for invoices.
- **Responsive UI:** Mobile-responsive React frontend with a modern design.
- **Form Validation :** Ensure proper data validation for invoice creation and editing.
  
## Demo

[Live Demo Application]([https://ss-bbq-scooter.onrender.com/](https://invoice-management-system-mn3d.onrender.com/))

## Getting Started

Follow the instructions below to get the project up and running locally.

### Prerequisites

- Node.js
- MongoDB
- React

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nitish-k00/Invoice-Management-System.git
   cd Invoice-Management-System
2. Install dependencies

   ```bash
   npm install
   
2. Setting Up Environment Variables
### Backend Environment Variables :

  ```bash
    MONGODB_URI=your_ MONGODB_URI
    PORT=5000
  ```

### Frontend Environment Variables

   ```bash
   REACT_APP_BACKEND_URL=your_backend_url
   ```

3. Usage

### Start the backend server:

   ```bash
   cd server
   npm start
   ```

### Start the frontend development server:

   ```bash
   cd client
   npm start
   ```


