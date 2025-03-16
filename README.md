# CraftConnect

CraftConnect is a smart community service access platform designed to help users find reliable professionals for various services such as plumbing, electrical work, house cleaning, and babysitting..

---

## Table of Contents
- [Project Overview](#project-overview)
- [Current Features](#current-features)
- [Future Plans](#future-plans)
- [Directory Structure](#directory-structure)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
  - [Prerequisites](#prerequisites)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
  - [Accessing the Application](#accessing-the-application)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
CraftConnect aims to connect users with service providers in their community. Users can browse available services, view details, and book appointments. Service providers can register and manage their profiles.

---

## Current Features
✅ User authentication (login and registration)  
✅ Browse and view details of available services  
✅ Book services  
✅ User profile management  
✅ Emotional intelligence resources  
✅ Chatbot for assistance  

---

## Future Plans
🚀 Implement payment gateway for service bookings  
🚀 Add reviews and ratings for service providers  
🚀 Expand the range of services offered  
🚀 Enhance the chatbot with more capabilities  
🚀 Integrate with third-party APIs for additional features  

---
## Directory Structure
```
.
├── .gitignore
├── README.md
├── LICENSE
├── backend/
│   ├── .env
│   ├── controllers/
│   │   ├── userController.js
│   │   └── userDetailsController.js
│   ├── data/
│   │   └── mongod.lock
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Service.js
│   │   ├── User.js
│   │   └── Booking.js
│   ├── package.json
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── userDetailsRoutes.js
│   │   └── userRoutes.js
│   └── server.js
└── frontend/
   ├── .env
   ├── .gitignore
   ├── package.json
   ├── public/
   │   ├── favicon.ico
   │   ├── index.html
   │   ├── logo192.png
   │   ├── logo512.png
   │   ├── manifest.json
   │   └── robots.txt
   ├── README.md
   └── src/
      ├── api.js
      ├── App.css
      ├── App.js
      ├── components/
      ├── contexts/
      ├── hooks/
      ├── pages/
      ├── utils/
      └── index.js
```

---

## Environment Variables
Both the backend and frontend require environment variables to function correctly. Create a `.env` file in both directories with the following content:

### Backend `.env`
```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GEMINI_API_KEY=<your_gemini_api_key>
REACT_FRONTEND_URL=http://localhost:3000
ENCRYPTION_KEY=<your_encryption_key>
```
Ensure that the ENCRYPTION_KEY in your .env file is 32 bytes long (64 hex characters)

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000
```

---

## How to Run

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Running the Backend
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```
4. The backend server will run on `http://localhost:5000`.

### Running the Frontend
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```
4. The frontend server will run on `http://localhost:3000`.

### Accessing the Application
- Open your browser and navigate to [`http://localhost:3000`](http://localhost:3000) to access the frontend.
- The frontend will communicate with the backend running on [`http://localhost:5000`](http://localhost:5000).

---

## Contributing
We welcome contributions to improve CraftConnect! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```sh
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push your changes to your fork:
   ```sh
   git push origin feature-branch
   ```
5. Submit a pull request with a detailed description of your changes.

---

## License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

