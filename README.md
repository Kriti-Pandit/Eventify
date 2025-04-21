# Eventify 🎪

A full-stack event management platform built with MERN stack (MongoDB, Express, React, Node.js) and Docker containerization.

![Eventify Dashboard](./client/src/assets/1.png)

## Table of Contents
- [Features](#features-)
- [Tech Stack](#tech-stack-)
- [Installation](#installation-)
- [Configuration](#configuration-)
- [API Reference](#api-reference-)
- [Screenshots](#screenshots-)
- [Development](#development-)
- [Deployment](#deployment-)
- [Contributing](#contributing-)
- [License](#license-)

## Features ✨
- **User Authentication**  
  ![Auth Screenshot](./client/src/assets/2.png)
  - JWT-based registration/login
  - Protected routes
  - Profile management

- **Event Management**  
  ![Events Screenshot](./client/src/assets/3.png)
  - Create events with vital information


- **Ticket Booking**  
  ![Tickets Screenshot](./client/src/assets/4.png)
  - Mock payment integration
  - QR ticket generation
  - Purchase history

## Tech Stack 🛠️
| Area        | Technology |
|-------------|------------|
| Frontend    | React 18, Tailwind CSS, Axios |
| Backend     | Node.js, Express, Mongoose |
| Database    | MongoDB Atlas |
| Auth        | JWT, Bcrypt |
| Container   | Docker, Docker Compose |

## Installation 🚀

### Prerequisites
- Node.js v18+
- Docker Desktop (for containerization)
- MongoDB Atlas account

### Local Setup
```bash
# Clone repository
git clone https://github.com/yourusername/Eventify.git
cd Eventify

# Install dependencies
cd api && npm install
cd ../client && npm install

