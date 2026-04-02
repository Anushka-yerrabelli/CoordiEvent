# CoordiEvent Platform

CoordiEvent is a modern, full-stack event service booking application. It is primarily built with standard Java (Spring Boot) and vanilla frontend web technologies (HTML/CSS/JS + TailwindCSS). This setup is completely self-contained, meaning you do not need Node.js to run the frontend; Spring Boot automatically serves the UI files.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT)
- **Database:** PostgreSQL
- **Frontend:** HTML5, CSS3, ES6 JavaScript, Tailwind CSS (via CDN), FontAwesome

## Role System
- **Categories:** ADMIN manages the global categories and service types.
- **Provider:** Creates event services (food, decor, venues, etc.), and sets their own distinct availability. Providers can Accept/Reject incoming booking requests.
- **Customer:** Searches for services across the system, places bookings, views their history, and rates/reviews completed bookings.

## Setup Instructions

### 1. Database Setup
1. Download and install PostgreSQL.
2. Open `psql` or pgAdmin and run:
   ```sql
   CREATE DATABASE coordievent_db;
   ```
3. Update `src/main/resources/application.properties` with your PostgreSQL username and password if they differ from `postgres/postgres`.

### 2. Running the Application
Since this is a standard Maven project, the easiest way to run it is through a Java IDE (IntelliJ IDEA, Eclipse, VS Code):
1. Import the `backend` folder as a Maven project into your IDE.
2. Run the `CoordiEventApplication.java` main class.
3. Hibernate will automatically create the tables, and the `DataSeeder` will populate the database with dummy categories, an Admin user, a Provider, a Customer, and a sample Service.

### 3. Accessing the UI
1. Once Spring Boot is running (default port 8080), open your browser and navigate to:
   ```text
   http://localhost:8080
   ```
2. The modern landing page will appear!

## Testing the Application (Sample Logins)

**Administrator:**
- Username: `admin`
- Password: `admin123`

**Service Provider:**
- Username: `provider1`
- Password: `provider123`

**Customer:**
- Username: `customer1`
- Password: `customer123`

Also, users can freely self-register without admin approval.

## Project Structure
- `src/main/java/.../model/`: JPA Entities (User, Service, Booking, etc.)
- `src/main/java/.../controller/`: REST API endpoints
- `src/main/java/.../security/`: JWT and Spring Security Configuration
- `src/main/resources/static/`: Frontend codebase (index.html, dashboard.html, js, css)
