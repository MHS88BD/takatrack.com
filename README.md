# 💰 Taka Track - Modern Personal Finance Tracker

<div align="center">

![Taka Track](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Build](https://img.shields.io/badge/Build-Passing-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

**A beautiful, modern personal finance tracker with glassmorphism UI**

[Live Demo](https://takatrack.dupno.com) • [Documentation](#documentation) • [Deployment Guide](DEPLOYMENT_CHECKLIST.md)

</div>

---

## ✨ Features

### 💳 **Multi-Wallet Management**
- Track multiple accounts (Bank, Cash, Credit Card)
- Real-time balance updates
- Transaction history per wallet

### 📊 **Smart Transaction Tracking**
- Income and expense categorization
- Subcategory support
- Visual analytics and charts
- Tag-based organization

### 🤝 **Loan Management**
- Track money lent and borrowed
- Party/contact management
- Payment history
- Automatic balance calculations

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Professional glass effects with backdrop blur
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Touch Optimized**: 44px minimum touch targets for mobile
- **Dark Theme**: Easy on the eyes with vibrant accents
- **Smooth Animations**: Polished transitions and micro-interactions

### 🔐 **Security**
- JWT authentication
- Bcrypt password hashing
- Role-based access control (USER/ADMIN)
- Secure API endpoints

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MHS88BD/takatrack.com.git
   cd takatrack.com
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
   ```bash
   # Backend (.env)
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma db seed  # Optional: seed demo data
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:5173
   ```

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Database
- **SQLite** - Development
- **PostgreSQL** - Production

---

## 📱 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Mobile View
![Mobile](docs/screenshots/mobile.png)

---

## 🎨 Design System

### Color Palette
```css
Primary:    #2563eb  /* Vibrant Blue */
Accent:     #8b5cf6  /* Violet */
Success:    #10b981  /* Green */
Danger:     #ef4444  /* Red */
Background: #050505  /* Deep Black */
```

### Components
- **Glass Modals**: Semi-transparent with 20px backdrop blur
- **Glass Inputs**: Dark background with subtle borders
- **Pill Buttons**: Rounded with glow effects
- **Responsive Grids**: Auto-stacking on mobile

---

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment instructions
- [API Documentation](DEPLOYMENT.md) - API endpoints and usage
- [Testing Guide](TESTING_GUIDE.md) - How to test the application
- [Quick Start](QUICK_START.md) - Get started quickly

---

## 🚀 Deployment

### Recommended Stack
- **Backend**: Railway or Render
- **Frontend**: Vercel
- **Database**: PostgreSQL (Railway/Render)

### Quick Deploy

**Backend (Railway)**
```bash
railway login
railway init
railway up
```

**Frontend (Vercel)**
```bash
vercel --prod
```

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for detailed instructions.

---

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test

# Build for production
npm run build
cd client
npm run build
```

---

## 📦 Project Structure

```
takatrack.com/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main app component
│   │   ├── App.css        # Styles
│   │   └── main.tsx       # Entry point
│   └── package.json
├── src/                   # Backend source
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   └── utils/            # Utilities
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   └── seed.ts          # Seed data
├── DEPLOYMENT_CHECKLIST.md
├── PRODUCTION_READY.md
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**S M MEJBA UL HAQUE**
- GitHub: [@MHS88BD](https://github.com/MHS88BD)
- Website: [takatrack.dupno.com](https://takatrack.dupno.com)

---

## 🙏 Acknowledgments

- Design inspiration from modern fintech apps
- Icons by [Lucide](https://lucide.dev)
- Built with ❤️ using React and TypeScript

---

## 📞 Support

For support, email support@takatrack.dupno.com or open an issue on GitHub.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [MHS88BD](https://github.com/MHS88BD)

</div>
