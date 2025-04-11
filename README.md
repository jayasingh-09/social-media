# Forms Application

## Description
A full-stack web application for user registration and post creation. The backend is built with Spring Boot and MySQL, while the frontend uses React with Vite, React Router DOM, Axios, and Material-UI.

## Features
- User registration with geolocation data
- CRUD operations for user forms
- Post creation and retrieval
- RESTful API with Spring Boot
- Frontend UI with Material-UI and React

## Technologies Used
### Backend:
- Java (Spring Boot)
- MySQL
- JPA/Hibernate
- REST APIs

### Frontend:
- React.js (Vite)
- React Router DOM
- Axios
- Material-UI

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Java 17+
- Spring Boot
- MySQL Server
- Node.js & npm

## Installation & Setup

### Backend Setup (Spring Boot)
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/forms-app.git
   cd forms-app
   ```
2. Set up MySQL Database:
   ```sh
   CREATE DATABASE demo;
   ```
3. Configure `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/demo
   spring.datasource.username="YOUR USERNAME"
   spring.datasource.password="YOUR PASSWORD"
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   ```
4. Run the Spring Boot application:
   ```sh
   mvn spring-boot:run
   ```

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm run dev
   ```

## Usage
- Once you run the social media application, grant location permission.
- Create an account and log in to your dashboard.
- You can add a post, and nearby posts will appear in your feed.
- Open `http://localhost:5173/` in the browser for the frontend.
- The backend API runs on `http://localhost:8080/`.
- Open `http://localhost:5173/` in the browser for the frontend.
- The backend API runs on `http://localhost:8080/`.

## API Endpoints
### User Registration (`/forms`)
- GET `/forms` - Fetch all users
- POST `/forms` - Register a new user
- GET `/forms/email/{email}` - Get user by email
- GET `/forms/{id}` - Get user by ID
- DELETE `/forms/{id}` - Delete user by ID

### Post Management (`/posts`)
- POST `/posts` - Create a post
- GET `/posts/nearby` - Get posts near a location

## Contribution
- Fork the repository.
- Create a feature branch.
- Commit changes and push.
- Open a pull request.

## License
This project is licensed under the MIT License.

## Author
[Jaya Singh](mailto:info2jayasingh@gmail.com)

