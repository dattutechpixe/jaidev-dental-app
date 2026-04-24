# Snehath Mitra - Healthcare Service & Equipment Booking Platform

Snehath Mitra is a comprehensive backend API for a healthcare platform that facilitates the booking of medical services (Doctors, Nurses, Lab Technicians) and the rental or purchase of medical equipment. It features robust user and admin management, secure payments, dynamic scheduling, and detailed reporting.

## 🚀 Features

### User Features
- **Authentication**: Secure sign-up/login via Phone OTP and Google OAuth.
- **Service Booking**: Browse and book healthcare professionals (Doctors, Nurses) based on category, experience, and availability.
- **Equipment Rental/Purchase**: Rent or buy medical equipment with flexible pricing (Hourly, Daily, Weekly, Monthly).
- **Cart & Checkout**: specialized cart system checking availability and conflicts.
- **Payments**: Integrated **Razorpay** for online payments and Cash On Delivery (COD) support.
- **Order Tracking**: Track booking status (Confirmed, Packing, Out for Delivery, Delivered).
- **Reviews & Ratings**: Rate services and equipment.
- **Blogs**: Read health-related articles.
- **User Profile**: Manage addresses, profile details, and view order history.

### Admin Features
- **Dashboard**: specialized Admin Dashboard with sales analytics and reporting.
- **Resource Management**: Create, update, and delete Services and Equipment.
- **Order Management**: View and manage all bookings (Pending, Confirmed, Cancelled).
- **Pagination**: Optimized endpoints for handling large datasets of bookings and logs.
- **User Management**: View and manage user accounts (Block/Unblock).
- **Notifications**: Send status updates and notifications to users.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens), Google OAuth 2.0
- **Payments**: Razorpay
- **File Storage**: AWS S3 & Cloudinary (via Multer)
- **Documentation**: Swagger UI / OpenAPI 3.0
- **Scheduling**: `node-cron` for availability resets and automated tasks.

## 📂 Project Structure

```
snehath-mitra/
├── src/
│   ├── config/             # Database, Auth, and 3rd-party configs
│   ├── controllers/        # Request logic (Bookings, Services, Equipment, etc.)
│   ├── middlewares/        # Auth, Error Handling, File Upload
│   ├── models/             # Mongoose Schemas (User, Booking, Equipment, etc.)
│   ├── routes/             # API Route definations
│   ├── utils/              # Helper functions (Razorpay, Cron jobs)
│   └── app.js              # App initialization
├── admin.Yaml              # Admin API Documentation (OpenAPI)
├── api.Yaml                # User API Documentation (OpenAPI)
├── server.js               # Server Entry Point
└── package.json            # Dependencies and scripts
```

## 🔧 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-repo/snehath-mitra.git
    cd snehath-mitra
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following keys:
    ```env
    PORT=5002
    SITE_NAME=Sehatmitra
    NODE_ENV=development
    
    # Database
    MONGO_URI=mongodb+srv://<your-db-url>

    # Authentication
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Payments
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret

    # File Storage (Cloudinary / AWS)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    AWS_ACCESS_KEY_ID=your_aws_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret
    AWS_BUCKET_NAME=your_bucket_name
    AWS_REGION=your_region
    ```

4.  **Run the Server**
    ```bash
    # Development mode (with nodemon)
    npm start
    ```

    The server will start on `http://localhost:5002` (or your defined PORT).

## 📖 API Documentation

The project includes interactive API documentation generated via Swagger UI.

- **User API Docs**: [http://localhost:5002/user-docs](http://localhost:5002/user-docs)
- **Admin API Docs**: [http://localhost:5002/admin-docs](http://localhost:5002/admin-docs)

You can test endpoints, view request/response schemas, and authenticate directly from these interfaces.

## 🧪 Key Endpoints Overview

- **Services**: `GET /Sehatmitra/services/filters` (Search with pagination)
- **Equipment**: `GET /Sehatmitra/equipment/filters` (Search with pagination & pricing)
- **Booking**: `POST /Sehatmitra/user/createbooking` (COD & Online)
- **Admin Bookings**: `GET /Sehatmitra/admin/viewll/bookings` (Paginated list)

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.