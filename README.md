# ⚽ JerseyVerse Frontend

Frontend application for **JerseyVerse**, a full-stack Football Jersey E-Commerce platform built with **React.js**.

The application provides a modern and responsive user interface for customers and administrators to browse products, manage shopping carts, place orders, and perform administrative operations. It communicates with the JerseyVerse Spring Boot backend through RESTful APIs to deliver a seamless e-commerce experience.

The frontend is designed using a component-based architecture with React, Redux Toolkit for state management, React Router for client-side routing, Axios for API communication, and Bootstrap for responsive user interfaces.

> **Status:** Completed ✅  
> Frontend Development • Backend Integration • Module Testing • End-to-End Regression Testing

## ✨ Features

### 🛍️ Customer Features
- Browse football jerseys
- View detailed product information
- Search, filter, and sort products
- Responsive product catalog
- Latest products section

### 🛒 Shopping Experience
- Add products to cart
- Update cart quantities
- Remove cart items
- Apply discount coupons
- Checkout workflow
- Order summary

### 👤 User Account
- User registration
- User login
- JWT-based authentication
- Profile management
- Address management
- Order history
- Invoice download

### 🛠️ Admin Dashboard
- Dashboard overview
- Product management
- Product image upload
- Customer management
- Order management
- Coupon management

### 🔄 Backend Integration
- RESTful API communication
- Axios-based HTTP requests
- JWT authentication
- Secure protected routes
- Multipart image upload support

### 🎨 User Experience
- Responsive design
- Component-based UI
- Smooth page navigation
- Loading indicators
- Form validation
- Interactive animations using Framer Motion

## 🛠️ Tech Stack

### Frontend Framework
- React 19
- JavaScript (ES6+)

### Routing
- React Router DOM

### State Management
- Redux Toolkit
- React Redux

### API Communication
- Axios

### UI & Styling
- Bootstrap 5
- React Bootstrap
- Bootstrap Icons
- React Icons

### Animations
- Framer Motion
- AOS (Animate On Scroll)

### Development Tools
- Create React App
- npm
- Git & GitHub
- Visual Studio Code

### Backend Integration
- Spring Boot REST APIs
- JWT Authentication
- Multipart File Upload

## 🏗️ Frontend Architecture

The JerseyVerse Frontend follows a component-based architecture to build a modular, maintainable, and responsive user interface. The application communicates directly with the Spring Boot backend using Axios to consume RESTful APIs.

### Application Flow

```text
                User Interaction
                       │
                       ▼
                React Components
                       │
                       ▼
             Redux Toolkit (State)
                       │
                       ▼
              Axios HTTP Requests
                       │
                       ▼
         Spring Boot REST APIs (Backend)
                       │
                       ▼
                  PostgreSQL Database
```

### Application Flow

1. The user interacts with the React interface.
2. Components dispatch actions and manage UI state.
3. Axios sends HTTP requests to the Spring Boot backend.
4. JWT tokens are included for protected requests.
5. The backend processes the request and returns JSON responses.
6. React updates the UI based on the received data.

### Design Principles

- Component-based architecture
- Reusable UI components
- Redux Toolkit for state management
- Client-side routing using React Router
- RESTful API communication with Axios
- Responsive UI with Bootstrap

## 📁 Project Structure

The frontend follows a modular, component-based structure to keep the codebase organized, reusable, and maintainable.

```text
src
├── admin
├── components
├── pages
├── redux
├── utils
├── App.css
├── App.js
├── index.css
└── index.js
```

### Folder Responsibilities

| Folder | Responsibility |
|---------|----------------|
| **admin** | Admin dashboard pages and management modules for products, orders, customers, and coupons. |
| **components** | Reusable UI components shared across the application. |
| **pages** | Customer-facing pages such as Home, Shop, Product Details, Cart, Checkout, and Orders. |
| **redux** | Redux Toolkit store configuration and application state management. |
| **utils** | Shared helper functions and utility modules. |
| **App.js** | Main application component containing route configuration and layout. |
| **index.js** | Application entry point that renders the React application. |
```

## 📄 Application Pages

### Customer Pages

- Home
- Shop
- Product Details
- Shopping Cart
- Checkout
- User Profile
- Address Management
- Order History
- Invoice View
- Authentication (Login & Registration)

### Admin Pages

- Dashboard
- Product Management
- Add / Update Products
- Order Management
- Customer Management
- Coupon Management

### Shared Components

- Navigation Bar
- Footer
- Product Cards
- Pagination
- Search & Filters
- Loading Indicators
- Protected Routes

## 🔄 State Management

The application uses **Redux Toolkit** for centralized state management where shared application state is required. Redux helps maintain a predictable state across different parts of the application while simplifying data flow.

### State Management Responsibilities

- User authentication state
- Logged-in user information
- Shared application data
- Global state updates
- Predictable state management using Redux Toolkit

Redux is integrated with React components using **React Redux**, enabling efficient state sharing throughout the application.

## 🔗 Backend Integration

The frontend communicates with the **JerseyVerse Spring Boot Backend** through RESTful APIs using **Axios**.

### Integration Highlights

- REST API communication using Axios
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access for Customer and Admin
- Multipart file upload for product images
- JSON request and response handling
- Real-time data synchronization with the backend

### Request Flow

```text
User Action
     │
     ▼
React Component
     │
     ▼
Axios HTTP Request
     │
     ▼
Spring Boot REST API
     │
     ▼
PostgreSQL Database
     │
     ▼
JSON Response
     │
     ▼
React UI Update
```

The frontend sends HTTP requests directly from React components and updates the user interface based on the responses received from the backend APIs.

## 🚀 Getting Started

Follow the steps below to set up and run the JerseyVerse Frontend locally.

### Prerequisites

Make sure the following software is installed on your system:

| Software | Version |
|----------|---------|
| Node.js | 18+ (Recommended) |
| npm | Latest |
| Git | Latest |
| Visual Studio Code (Recommended) | Latest |

---

## Clone the Repository

```bash
git clone https://github.com/jainishpatel25/jerseyverse-frontend.git

cd jerseyverse-frontend
```

---

## Install Dependencies

Using npm:

```bash
npm install
```

---

## Configure Environment Variables

Open the `.env` file located in the project root.

Example:

```env
REACT_APP_API_URL=http://localhost:8081
```

Update the backend URL if your backend is running on a different host or port.

---

## Start the Development Server

```bash
npm start
```

The application will start on:

```text
http://localhost:3000
```

Ensure the JerseyVerse Backend is running before using the application.

## ⚙️ Configuration

The frontend uses environment variables to configure backend communication.

The project currently requires the following variable:

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Base URL of the JerseyVerse Backend API |

Example:

```env
REACT_APP_API_URL=http://localhost:8081
```

> **Note:** Update this value if the backend is hosted on a different server or port.

## 🔗 Related Repository

The JerseyVerse Frontend is part of the complete **JerseyVerse** full-stack Football Jersey E-Commerce application.

| Repository | Description |
|------------|-------------|
| **JerseyVerse Backend** | Spring Boot REST API providing authentication, product management, cart, orders, coupons, invoices, and administrative features. |

> **Backend Repository:** https://github.com/jainishpatel25/jerseyverse-backend-java

## 🚀 Future Improvements

The following enhancements can be considered for future versions of the project:

- Improve UI/UX with additional animations and micro-interactions.
- Add comprehensive frontend unit and integration testing.
- Implement lazy loading for route-based code splitting.
- Enhance accessibility (WCAG compliance).
- Add Progressive Web App (PWA) support.
- Improve SEO for public-facing pages.
- Introduce theme customization (Light/Dark Mode).
- Optimize performance using advanced React optimization techniques.
- Deploy the frontend to a cloud hosting platform.

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more information.

## 👨‍💻 Author

**Jainish Patel**

Java Backend & Full Stack Developer passionate about building scalable, secure, and user-friendly web applications using Java, Spring Boot, React, and modern web technologies.

- GitHub: https://github.com/<your-github-username>
- LinkedIn: https://www.linkedin.com/in/<your-linkedin-profile>

If you found this project helpful, consider giving the repository a ⭐.
