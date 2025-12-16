# Employee Leave Management System - Backend

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2.1-black)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange)](https://jwt.io/)

A robust Express.js API server for employee leave management with JWT authentication, MongoDB integration, and comprehensive leave request processing.

## 🚀 Features

### Core API Features
- **RESTful API** - Well-structured REST endpoints
- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Separate permissions for employees and managers
- **MongoDB Integration** - NoSQL database with Mongoose ODM
- **Input Validation** - Server-side validation and sanitization
- **Error Handling** - Comprehensive error responses
- **CORS Support** - Cross-origin resource sharing configuration

### Business Logic
- **Leave Balance Management** - Automatic calculation and validation
- **Overlap Prevention** - Prevents conflicting leave requests
- **Request Processing** - Approve/reject workflow with comments
- **Data Aggregation** - Complex queries for statistics and reporting
- **Audit Trail** - Timestamps and user tracking

## 🛠️ Tech Stack

- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and verification
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development auto-restart

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** package manager

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the backend root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leave_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_at_least_32_characters_long_and_random_!@#$%^&*()
CLIENT_URL=https://leavehub.vercel.app
CLIENT_URL_LOCAL=http://localhost:5173
```

### Environment Variables Guide:
- **PORT**: Server port (default: 5000)
- **MONGO_URI**: MongoDB Atlas connection string
- **JWT_SECRET**: Secure random string (min 32 chars)
- **CLIENT_URL**: Production frontend URL
- **CLIENT_URL_LOCAL**: Development frontend URL

Edit the `.env` file with your actual values:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/leave_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Environment
NODE_ENV=development
```

### Development

```bash
# Start development server with auto-restart
npm run dev
```

The API will be available at `http://localhost:5000`

### Production

```bash
# Start production server
npm start
```

## 🚀 Deployment

### Deploy to Render.com (Recommended)

1. **Connect Repository**: Link your GitHub repository to Render
2. **Service Type**: Select "Web Service"
3. **Build Settings**:
   - **Runtime**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**: Add all variables from `.env`
5. **Deploy**: Your API will be live at `https://your-app-name.onrender.com`

### Deploy to Railway/Heroku

Similar setup with environment variables and build commands.

### Live API
- **Production**: [[https://employee-leave-management-backend.onrender.com/](https://employee-leave-management-backend.onrender.com/)]
- **Development**: `http://localhost:5000/api`

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic (login/signup)
│   ├── leaveController.js    # Leave request operations
│   └── managerController.js  # Manager-specific operations
├── middlewares/
│   ├── authMiddleware.js     # JWT authentication middleware
│   └── roleMiddleware.js     # Role-based access control
├── models/
│   ├── User.js              # User schema and model
│   └── LeaveRequest.js      # Leave request schema and model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── leaveRoutes.js       # Leave management routes
│   └── managerRoutes.js     # Manager routes
├── utils/
│   └── generateToken.js     # JWT token generation utility
├── .env                     # Environment variables (create this)
├── package.json             # Dependencies and scripts
├── server.js                # Main application entry point
└── README.md                # This file
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST /signup     # User registration
POST /login      # User authentication
```

### Leave Routes (`/api/leaves`) - Employee Access
```
POST /request    # Submit leave request
GET  /requests   # Get user's leave requests
GET  /balance    # Get leave balance information
```

### Manager Routes (`/api/manager`) - Manager Access Only
```
GET  /requests          # Get all leave requests
PUT  /requests/:id      # Approve/reject leave request
GET  /employees         # Get all employees
GET  /leave-calendar    # Get calendar data for team view
```

## 📊 Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['employee', 'manager'], default: 'employee'),
  leaveBalance: Number (deprecated, kept for compatibility),
  leaveBalances: {
    sick: Number (default: 7),
    casual: Number (default: 8),
    paid: Number (default: 3),
    vacation: Number (default: 2)
  },
  timestamps: true
}
```

### LeaveRequest Model
```javascript
{
  employee: ObjectId (ref: 'User', required),
  leaveType: String (enum: ['sick', 'casual', 'paid', 'vacation'], required),
  startDate: Date (required),
  endDate: Date (required),
  reason: String,
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  managerComment: String,
  timestamps: true
}
```

## 🔒 Security

### Authentication
- **JWT Tokens** - Stateless authentication with expiration
- **Password Hashing** - bcryptjs with salt rounds
- **Token Validation** - Middleware for protected routes

### Authorization
- **Role-based Access** - Employee vs Manager permissions
- **Route Protection** - Middleware guards for sensitive endpoints
- **Input Validation** - Server-side validation for all inputs

### Data Protection
- **Password Exclusion** - Sensitive fields removed from responses
- **SQL Injection Prevention** - Mongoose built-in protection
- **XSS Prevention** - Input sanitization

## 🧪 API Testing

### Using cURL

#### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "employee"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Apply for leave (requires token)
```bash
curl -X POST http://localhost:5000/api/leaves/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "leaveType": "sick",
    "startDate": "2024-01-15",
    "endDate": "2024-01-16",
    "reason": "Medical appointment"
  }'
```

### Using Postman/Insomnia

1. **Import the following collection structure:**
   - Auth
     - POST /api/auth/signup
     - POST /api/auth/login
   - Leaves
     - POST /api/leaves/request
     - GET /api/leaves/requests
     - GET /api/leaves/balance
   - Manager
     - GET /api/manager/requests
     - PUT /api/manager/requests/:id
     - GET /api/manager/employees
     - GET /api/manager/leave-calendar

2. **Set Authorization** for protected routes:
   - Type: Bearer Token
   - Token: `YOUR_JWT_TOKEN_FROM_LOGIN`

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leave_management
JWT_SECRET=your_production_secret_key_make_it_long_and_random
```

### Production Deployment

```bash
# Install dependencies
npm ci --only=production

# Start the server
npm start
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development

### Available Scripts

```bash
# Development with auto-restart
npm run dev

# Production start
npm start

# Test (when implemented)
npm test
```

### Code Structure Guidelines

- **Controllers** - Handle business logic and responses
- **Models** - Define data schemas and validation
- **Routes** - Define API endpoints and middleware
- **Middlewares** - Authentication, authorization, and validation
- **Utils** - Helper functions and utilities

### Error Handling

The API uses consistent error response format:

```json
{
  "message": "Error description",
  "error": "Optional detailed error information"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📊 Database Operations

### Default Leave Allocations
- **Sick Leave**: 7 days per year
- **Casual Leave**: 8 days per year
- **Paid Leave**: 3 days per year
- **Vacation Leave**: 2 days per year

### Key Business Rules
- **Balance Deduction**: Only on approval, prevents over-allocation
- **Overlap Prevention**: No overlapping pending/approved requests
- **Date Validation**: Past dates not allowed
- **Balance Validation**: Cannot exceed available balance

### Aggregation Queries
- **Leave Balance Calculation**: Complex aggregation for per-type balances
- **Statistics Generation**: Dashboard statistics and reporting
- **Calendar Data**: Team calendar with approved leaves

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Or for Windows
net start MongoDB

# Verify connection string in .env
```

**JWT Token Issues**
- Check `JWT_SECRET` in .env file
- Ensure token hasn't expired (24 hours default)
- Verify token format in Authorization header

**CORS Errors**
- Check frontend is running on correct port
- Verify CORS configuration in server.js
- Ensure API URL matches in frontend

**Validation Errors**
- Check request body format
- Verify required fields are present
- Ensure date formats are correct (YYYY-MM-DD)

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

### Logs

Check application logs for:
- Database connection status
- Authentication attempts
- API request/response details
- Error stack traces

## 🤝 Contributing

1. Follow existing code structure and naming conventions
2. Add proper error handling and validation
3. Update API documentation for new endpoints
4. Test thoroughly with different scenarios
5. Ensure backward compatibility

## 📝 License

This project is part of the Employee Leave Management System and follows the same license terms.

## 🔄 API Versioning

Current API version: **v1**

Future versions will be indicated by URL path:
- `/api/v1/auth/login`
- `/api/v2/auth/login`

---

**Built with ❤️ using Express.js and MongoDB**
