# LibraNova: Full-Stack Library Management System with React and Spring Boot

This project was developed as part of my **Bachelorarbeit (Bachelor’s Thesis)**.

## Overview

**LibraNova** is a modern, responsive library management web application designed to enhance the user experience for both readers and administrators. Built with **React** (frontend) and **Spring Boot** (backend), the application enables users to search for books, borrow available titles, submit reviews, and interact with real-time book data. Administrators can efficiently manage the catalog, track borrowing activities, and respond to user inquiries.

The application also features a robust **authentication and authorization** system using **JWT**, **OAuth2**, and **OpenID Connect**, and integrates **Stripe API** for secure payments related to premium library services.

## Core Functionalities

### 👥 User Features
1. **User Registration & Login**  
   - Secure account creation and login using JWT & OAuth2.  
   - Role-based access (user/admin) using **Spring Security**.

2. **Book Discovery & Borrowing**  
   - Search books by title, author, or category.  
   - View availability, reserve or borrow books.  
   - Get notified of wait times for unavailable books.

3. **Book Details & Reviews**  
   - View ratings and reviews for each book.  
   - Add personal reviews after borrowing a book.

### 🛠️ Admin Features
1. **Book Catalog Management**  
   - Add, edit, or delete books and stock info.  
   - Track borrow/return activity in real-time.

2. **User Communication**  
   - Respond to user messages and manage feedback.

3. **Payment Integration**  
   - Handle paid services via secure **Stripe API**.

## Technologies Used

### 📌 Back-End:
- **Spring Boot** for RESTful API development
- **Spring Security** for robust user authentication
- **Spring Data JPA** with **MySQL**
- **JWT**, **OAuth2**, **OpenID Connect** for secure auth
- **Stripe API** for payment handling

### 🎯 Front-End:
- **React** (with **TypeScript**) for UI
- **Redux** for state management
- **Axios**, **React Router**

### 🧪 Testing:
- **JUnit** & **Mockito** for backend testing
- **Selenium** for end-to-end frontend testing

## Acknowledgments

Special thanks to my supervisor **Prof. Dr. Georg Schneider** for continuous support and academic guidance throughout the Bachelor thesis period.
