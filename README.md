# 💰 SMMUH Personal Finance Tracker

A modern, full-stack personal finance management application with a beautiful glassmorphism UI and comprehensive financial tracking features.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 📊 Financial Management
- **Income & Expense Tracking**: Record and categorize all your transactions
- **Debt & Credit Management**: Track loans (lent/borrowed) with repayment schedules
- **Asset & Liability Tracking**: Monitor your net worth with comprehensive asset management
- **Categories & Tags**: Organize transactions with custom categories and tags
- **Party Management**: Keep track of people you lend to or borrow from

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effect with backdrop blur
- **Dark Mode**: Eye-friendly dark theme with gradient accents
- **Fully Responsive**: Seamless experience on desktop, tablet, and mobile
- **Smooth Animations**: Polished micro-interactions and transitions
- **Mobile Menu**: Collapsible sidebar for mobile devices

### 🔒 Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **Protected Routes**: User-specific data access control
- **CORS Enabled**: Secure cross-origin requests

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js**: RESTful API server
- **TypeScript**: Type-safe backend development
- **Prisma ORM**: Modern database toolkit
- **SQLite**: Development database (PostgreSQL recommended for production)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type-safe frontend development
- **Vite**: Lightning-fast build tool
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client
- **CSS Variables**: Custom design system

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Antigravity Projects"
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
```

5. **Run database migrations**
```bash
npx prisma migrate dev
npx prisma generate
```

6. **Start the development servers**

Backend:
```bash
npm run dev
```

Frontend (in a new terminal):
```bash
cd client
npm run dev
```

The backend will run on `http://localhost:3000` and the frontend on `http://localhost:5173`.

## 🧪 Testing

Run the comprehensive API test suite:
```bash
node test-api.js
```

This will test all endpoints including:
- ✅ Authentication (register/login)
- ✅ Categories & SubCategories
- ✅ Tags
- ✅ Transactions
- ✅ Parties
- ✅ Loans & Repayments
- ✅ Assets & Liabilities
- ✅ Filtering capabilities

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

#### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `POST /categories/subcategory` - Create subcategory

#### Tags
- `GET /tags` - Get all tags
- `POST /tags` - Create tag
- `PUT /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag

#### Transactions
- `GET /transactions` - Get all transactions (supports filters: type, category_id, startDate, endDate)
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Get single transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

#### Parties
- `GET /parties` - Get all parties
- `POST /parties` - Create party
- `PUT /parties/:id` - Update party
- `DELETE /parties/:id` - Delete party

#### Loans
- `GET /loans` - Get all loans (supports filters: type, status, party_id)
- `POST /loans` - Create loan
- `GET /loans/:id` - Get single loan with repayments
- `POST /loans/:id/repay` - Add repayment
- `GET /loans/summary` - Get loan summary (total lent/borrowed)

#### Assets & Liabilities
- `GET /assets-liabilities` - Get all assets/liabilities (supports filter: type)
- `POST /assets-liabilities` - Create asset/liability
- `PUT /assets-liabilities/:id` - Update asset/liability
- `DELETE /assets-liabilities/:id` - Delete asset/liability
- `GET /assets-liabilities/net-worth` - Get net worth summary

## 🎯 Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── App.css        # Component styles
│   │   └── index.css      # Global styles & design system
│   └── package.json
├── src/                   # Backend source code
│   ├── controllers/       # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── test-api.js           # Comprehensive API tests
├── package.json
└── README.md
```

## 🌐 Deployment

### Backend Deployment (Railway/Render)

1. Update `DATABASE_URL` to PostgreSQL connection string
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd client
npm run build
```

2. Update API URL in frontend code to point to production backend

3. Deploy the `client/dist` folder

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV="production"
```

**Frontend**
Update the API URL in `client/src/App.tsx`:
```typescript
const API_URL = 'https://your-backend-url.com/api/v1';
```

## 📱 Screenshots

### Desktop View
- Modern glassmorphism dashboard
- Responsive stat cards
- Transaction history

### Mobile View
- Hamburger menu navigation
- Optimized card layouts
- Touch-friendly interface

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

SMMUH Finance Team

## 🙏 Acknowledgments

- Built with React, Express, and Prisma
- Icons by Lucide React
- Inspired by modern fintech applications

---

**Status**: ✅ Production Ready | **Last Updated**: November 2025
