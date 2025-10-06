# LibraNova: Full-Stack Library Management System with Spring Boot and React 

This project was developed as part of my **Bachelorarbeit (Bachelor’s Thesis)**.

## Overview

**LibraNova** is a modern, responsive library management web application designed to enhance the user experience for both readers and administrators. Built with **React** (frontend) and **Spring Boot** (backend), the application enables users to search for books, borrow available books, submit reviews, and interact with real-time book data. Administrators can efficiently manage the catalog by adding, removing, or updating book quantities, as well as responding to user inquiries.

The application also features a robust **authentication and authorization** system using **JWT**, **OAuth2**, and **OpenID Connect**, and integrates **Stripe API** for secure payments related to paid services.

## Core Functionalities

### 👥 User Features
1. **User Registration & Login**  
   - Secure account login using JWT & OAuth2.  
   - Role-based access (user/admin) using **Spring Security**.

2. **Book Discovery & Borrowing**  
   - Search books by title, author, or category.  
   - View availability and borrow up to **five books** at a time.
 
3. **Book Details & Reviews**  
   - View ratings and reviews for each book.  
   - Submit personal reviews after borrowing.
  
4. **Shelf page**  
   - Track current borrowings and return history.  
   - Extend borrow periods and return books manually.
  
5. **Inquiries**  
   - Send inquiries to library admins.  
   - Browse the response history of answered messages.

### 🛠️ Admin Features
1. **Book Catalog Management**  
   - Add and update book entries and quantities.  
   - Delete books or update stock information. 

2. **User Communication**  
   - Read and respond to user messages and inquiries.

3. **Payment Integration**  
   - Handle paid services via secure **Stripe API**.

## Technologies Used

### 📌 Back-End:
- **Spring Boot** for RESTful API development
- **Spring Security** with **JWT**, **OAuth2**, and **OpenID Connect** for secure authentication
- **Spring Data JPA** with **MySQL**
- **Spring Data REST** for automatic repository exposure  
- **Stripe API** for payment handling
- **Swagger** for API documentation  
- **HTTPS** with **SSL/TLS** encryption for secure communication
  
### 🎯 Front-End:
- **React** (with **TypeScript**) for UI
- **Bootstrap**, **HTML**, and **CSS** for responsive design  
- **i18next** for multilingual support (English & German)  

### 🧪 Testing:
- **JUnit** & **Mockito** for backend testing
- **Postman** for API testing and integration validation  

### 🐳 Deployment & Containerization:
- **Docker** to containerize backend, frontend, and database  

## Acknowledgments

Special thanks to my supervisor **Prof. Dr. Georg Schneider** for continuous support and academic guidance throughout the Bachelor thesis period.
