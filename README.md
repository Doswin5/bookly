This project demonstrates my ability to design and build a real-world fullstack booking system with backend-driven booking logic, authentication, role-based access control, and appointment management workflows.

# BookWise – Full Stack Appointment Booking System

BookWise is a full-stack booking and appointment management application that allows users to register, log in securely, view available appointment slots, book sessions, manage their bookings, and cancel appointments.

The application also allows admins/service providers to create slots, manage bookings, and control appointment availability while preventing double bookings through backend validation and database constraints.

The application uses JWT authentication, Google authentication, MongoDB for data storage, and was fully deployed using Render (backend) and Vercel (frontend).

---

## Live Demo

Frontend:  
https://your-vercel-frontend-url.vercel.app/

Backend API:  
https://your-render-backend-url.onrender.com/

---

## Features

### Authentication
- User registration
- User login
- Google authentication
- JWT authentication
- Protected backend routes
- Protected frontend routes
- Role-based authorization
- Persistent login using localStorage token storage
- Logout functionality

### Booking System
- View available appointment slots
- Book available slots
- Cancel bookings
- Prevent double bookings
- Prevent booking past slots
- Prevent cancelling past bookings
- Real-time slot availability updates after booking/cancellation

### Admin Features
- Create appointment slots
- View all bookings
- Filter bookings by date and status
- Cancel user bookings
- Cancel appointment slots
- Delete appointment slots
- Prevent editing/deleting booked slots

### UX & Validation
- Loading states
- Empty states
- Confirmation modals
- Date filtering
- Toast notifications
- Frontend form validation
- Backend validation
- Protected admin routes
- Error handling

---

## Tech Stack

### Frontend
- React
- React Router
- Context API
- Axios
- Tailwind CSS
- Vite
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Google Auth Library

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## API Endpoints

### Auth Routes
POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/google  
GET /api/auth/me  

### Slot Routes
GET /api/slots  
POST /api/slots  
PATCH /api/slots/:id  
PATCH /api/slots/:id/cancel  
DELETE /api/slots/:id  

### Booking Routes
POST /api/bookings  
GET /api/bookings/my  
PATCH /api/bookings/:id/cancel  

### Admin Booking Routes
GET /api/bookings/admin/all  
PATCH /api/bookings/admin/:id/cancel  

---

## Local Setup Instructions

### Clone repository

```bash
git clone https://github.com/Doswin5/bookly.git
cd bookly
```

---

### Backend setup

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
```

Run backend:

```bash
npm run dev
```

---

### Frontend setup

```bash
cd client
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:

```bash
npm run dev
```

---

## Production Challenges I Solved

### Double Booking Prevention
Implemented backend validation and MongoDB compound unique indexes to prevent multiple confirmed bookings for the same slot.

### Backend-Driven Booking Logic
The backend controls slot ownership and booking availability instead of relying on frontend checks.

### Date & Time Handling
Stored dates in UTC format while displaying local formatted times on the frontend.

### Access Control
Implemented protected routes and role-based middleware for admin-only actions.

### Booking State Synchronization
Updated frontend state immediately after booking or cancellation without requiring full page refreshes.

### Deployment & CORS
Configured frontend/backend communication between Vercel and Render environments with secure CORS settings.

### Google Authentication
Integrated Google login with backend token verification using Google Identity Services.

---

## Key Lessons Learned

- Designing backend-driven booking systems
- Preventing race conditions and duplicate bookings
- Managing date and time handling in fullstack applications
- Implementing role-based access control
- Structuring scalable REST APIs
- Handling frontend and backend validation together
- Managing authentication with JWT and Google OAuth
- Deploying fullstack applications to production

---

## Future Improvements

- Email appointment reminders
- Multi-provider booking support
- Recurring availability schedules
- Calendar integrations
- Reschedule bookings
- Pagination and search
- Booking analytics dashboard

---

## Author

Built by Dosunmu Ayomide  

Fullstack Developer focused on building scalable and production-ready web applications.

GitHub: https://github.com/Doswin5
