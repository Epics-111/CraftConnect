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
├── LICENSE
├── README.md
├── backend
    ├── controllers
    │   ├── userController.js
    │   └── userDetailsController.js
    ├── data
    │   └── mongod.lock
    ├── middleware
    │   └── authMiddleware.js
    ├── models
    │   ├── Booking.js
    │   ├── Review.js
    │   ├── Service.js
    │   └── User.js
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── bookingRouter.js
    │   ├── chatbotRoutes.js
    │   ├── serviceRouter.js
    │   ├── services.js
    │   ├── userDetailsRoutes.js
    │   └── userRoutes.js
    ├── scripts
    │   └── addServicesWithLocations.js
    ├── server.js
    └── utils
    │   └── encryption.js
├── craftconnect.pem
├── docker-compose.yml
├── flask_auth
    ├── .env
    ├── app.py
    ├── requirements.txt
    └── utils
    │   └── encryption.py
├── frontend
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   ├── favicon.ico
    │   ├── icon.jpg
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   ├── robots.txt
    │   └── team
    │   │   ├── Aaron Alva.jpg
    │   │   ├── Aparna Yadav.jpg
    │   │   ├── Mansi Yadav.jpg
    │   │   ├── Mohammad Ammar.jpg
    │   │   ├── Palaskar Urvija Sanjay.jpg
    │   │   ├── Sana Yasmine.jpg
    │   │   ├── Simran Gupta.jpg
    │   │   ├── Simran.jpg
    │   │   └── Sk Sahil Islam.jpg
    ├── src
    │   ├── App.css
    │   ├── App.js
    │   ├── api.js
    │   ├── auth.js
    │   ├── components
    │   │   ├── BookingForm.js
    │   │   ├── Chatbot.css
    │   │   ├── Chatbot.js
    │   │   ├── ChatbotWidget.css
    │   │   ├── ChatbotWidget.js
    │   │   ├── Footer.css
    │   │   ├── Footer.js
    │   │   ├── Header.css
    │   │   ├── Header.js
    │   │   ├── NearbyServices.css
    │   │   ├── NearbyServices.jsx
    │   │   ├── ProtectedRoute.js
    │   │   ├── ProviderProfile.js
    │   │   ├── SearchBar.css
    │   │   ├── SearchBar.js
    │   │   ├── SkeletonLoader.js
    │   │   └── StarRating.js
    │   ├── index.css
    │   ├── index.js
    │   ├── pages
    │   │   ├── About.js
    │   │   ├── BookingHistory.js
    │   │   ├── Contact.js
    │   │   ├── Dashboard.css
    │   │   ├── Dashboard.js
    │   │   ├── FAQs.js
    │   │   ├── LoginSignup.css
    │   │   ├── LoginSignup.js
    │   │   ├── NearbyServicesPage.js
    │   │   ├── NotFound.js
    │   │   ├── Privacy.js
    │   │   ├── Reviews.js
    │   │   ├── SearchResults.js
    │   │   ├── ServiceDetails.js
    │   │   ├── ServiceListByTitle.js
    │   │   ├── Services.js
    │   │   ├── Terms.js
    │   │   ├── UserDetails.css
    │   │   └── UserDetails.js
    │   └── reportWebVitals.js
    └── tailwind.config.js
├── package-lock.json
└── package.json

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
- The hosted link is on [`https://craftconnect-app.azurewebsites.net/`](https://craftconnect-app.azurewebsites.net/).

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

