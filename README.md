# 🌍 **Natours API**

Welcome to **Natours**! A cutting-edge tour management API built using **Node.js**, **Express**, **MongoDB**, and **Mongoose**. This project is designed to help users explore, book, and manage nature tours effortlessly. 🌿🌄

- 🚀 **Live Project**: [Natours on Vercel](https://natours-bay-one.vercel.app/)
- 📖 **API Documentation**: [Postman Docs](https://documenter.getpostman.com/view/38039877/2sAXqs5gcB)

## 📜 **Project Overview**

This project was developed as part of a course by [Jonas Schmedtmann](https://github.com/jonasschmedtmann). It features a full-fledged RESTful API for tour management, user authentication, and more.

### ✨ **Key Features**

- 🔐 **JWT Authentication & Authorization**: Secure login and sign-up functionality with password reset.
- 🗺️ **Tour Management**: Create, read, update, and delete (CRUD) tours with advanced filtering and sorting.
- 💸 **Booking System**: Fully functional tour booking system with payment integration via **Stripe**.
- 🔧 **Role-Based Access**: Different user roles (Admin, Lead Guide, Guide, User) with permissions.
- 📦 **File Upload**: Upload and resize images with **Multer** and **Sharp**.
- 🔍 **Advanced Querying**: Efficient filtering, pagination, and sorting for tour data.
- 📬 **Email Integration**: Sending emails via **Brevo** (SendinBlue).
- ⚡ **Performance & Security**: Implementing rate limiting, data sanitization, and security headers.
- 🌩️ **Cloud Integration**: **Cloudinary** for image hosting, and **MongoDB Atlas** for cloud database hosting.

## 🛠️ **Technologies Used**

### **Backend: Node.js & Express.js** 🟢
Node.js is a powerful JavaScript runtime built on Chrome's V8 engine, enabling fast and scalable server-side applications. **Express.js** is a minimal and flexible Node.js web application framework, providing robust features for web and mobile applications.

### **Database: MongoDB & Mongoose** 🗄️
**MongoDB** is a NoSQL database that allows for storing data in flexible, JSON-like documents, making it easy to work with complex data structures. **Mongoose** is an ODM (Object Data Modeling) library that provides a schema-based solution for modeling application data in MongoDB.

### **Authentication: JSON Web Tokens (JWT)** 🔒
JWT is an open standard for securely transmitting information between parties as a JSON object. It is used for authentication and information exchange, ensuring data integrity and authenticity.

### **File Uploads: Multer & Sharp** 📷
**Multer** is a middleware for handling `multipart/form-data`, primarily used for uploading files. **Sharp** is an image processing library that helps in resizing and optimizing images efficiently.

### **Payment Gateway: Stripe API** 💳
Stripe is a payment processing platform that allows you to accept payments and manage subscriptions. It offers a robust API that integrates seamlessly with various web and mobile applications.

### **Email Service: Brevo (SendinBlue)** ✉️
Brevo, formerly known as SendinBlue, is an email marketing service that allows you to send marketing and transactional emails. It provides a powerful API for integrating email functionalities into applications.

### **Cloud Storage: Cloudinary** ☁️
Cloudinary is a cloud service that offers an end-to-end solution for managing images and videos, allowing for automatic image optimization and transformation.

### **Deployment: Vercel & Heroku** 🚀
- **Vercel** is a platform for frontend frameworks and static sites, enabling seamless deployment and optimization.
- **Heroku** is a cloud platform that allows building, running, and operating applications entirely in the cloud, known for its simplicity in deploying backend applications.

---

This project is licensed under the MIT License. For more details, see the LICENSE file.

---

Made with ❤️ by **Hussein Mohamed**. 🌱 Based on the teachings of [**Jonas Schmedtmann**](https://github.com/jonasschmedtmann).
