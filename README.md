# 🔗 Sniplink — URL Shortener with Analytics

A full-stack URL shortener with powerful analytics, built with React, Node.js, Express, and MongoDB. Shorten URLs, track clicks, generate QR codes, and gain insights through a beautiful SaaS-style dashboard.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Video Demo](#-video-demo)
- [Future Improvements](#-future-improvements)
- [Assumptions](#-assumptions)
- [AI Planning Document](#-ai-planning-document)
- [GitHub Submission](#-github-submission)

---

## 🌟 Overview

**Sniplink** is a modern URL shortening platform that helps you:

- Transform long URLs into short, shareable links
- Track every click with detailed analytics
- Generate QR codes for offline sharing
- Manage your links through a premium SaaS dashboard

---

## ✨ Features

### Core Features
- ✅ **User Authentication** — Secure signup/login with JWT & bcrypt
- ✅ **URL Shortening** — Generate unique short codes using nanoid
- ✅ **Dashboard** — View, search, and manage all your links
- ✅ **Click Analytics** — Track total clicks per URL
- ✅ **Delete URLs** — Remove links and associated analytics
- ✅ **Copy to Clipboard** — One-click copy of short URLs

### Bonus Features
- ✅ **Custom Aliases** — Create branded short links (e.g., `/my-brand`)
- ✅ **QR Code Generation** — Auto-generated downloadable QR codes
- ✅ **Link Expiry** — Set expiration dates for short URLs
- ✅ **Device/Browser Analytics** — Track browsers, devices, and OS
- ✅ **Click Trend Charts** — Line/area charts showing click patterns
- ✅ **Public Stats Page** — Share analytics publicly without auth
- ✅ **Edit Destination URL** — Update where links redirect to
- ✅ **CSV Bulk Upload** — Shorten hundreds of URLs at once
- ✅ **Deployment Ready** — Configured for Render + Vercel

### UI/UX
- ✅ **Modern SaaS Design** — Dark theme with glassmorphism effects
- ✅ **Responsive Layout** — Works on desktop, tablet, and mobile
- ✅ **Smooth Animations** — Framer Motion page transitions
- ✅ **Loading States** — Skeleton loaders and spinners
- ✅ **Toast Notifications** — Success/error feedback
- ✅ **Form Validation** — Client + server-side validation

---

## 🛠 Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3                    |
| Animations | Framer Motion                                     |
| Charts     | Recharts                                          |
| Backend    | Node.js, Express.js                               |
| Database   | MongoDB with Mongoose ODM                         |
| Auth       | JWT (jsonwebtoken) + bcryptjs                     |
| URL Codes  | nanoid v3                                         |
| QR Codes   | qrcode (backend) + qrcode.react (frontend)        |
| Validation | validator.js (backend)                            |
| Analytics  | ua-parser-js (user-agent parsing)                 |
| CSV        | csv-parse + multer (file upload)                  |
| HTTP       | Axios with JWT interceptors                       |
| Toasts     | react-hot-toast                                   |
| Icons      | react-icons (Heroicons 2)                         |
| Dates      | date-fns                                          |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React App (Vite + Tailwind + Framer Motion)         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐           │  │
│  │  │ Auth     │ │Dashboard │ │ Analytics  │           │  │
│  │  │ Pages    │ │ + CRUD   │ │ + Charts   │           │  │
│  │  └────┬─────┘ └────┬─────┘ └─────┬──────┘           │  │
│  │       └─────────────┼─────────────┘                   │  │
│  │                     │ Axios + JWT                     │  │
│  └─────────────────────┼────────────────────────────────┘  │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │ HTTP (REST API)
┌────────────────────────┼────────────────────────────────────┐
│                   EXPRESS SERVER                            │
│  ┌─────────────────────┼────────────────────────────────┐  │
│  │              API Router                               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐           │  │
│  │  │/api/auth │ │/api/urls │ │/api/analyt │           │  │
│  │  └────┬─────┘ └────┬─────┘ └─────┬──────┘           │  │
│  │       │             │             │                   │  │
│  │  ┌────┴─────────────┴─────────────┴──────┐           │  │
│  │  │         Middleware Layer               │           │  │
│  │  │  (JWT Auth, Error Handler, CORS)       │           │  │
│  │  └────────────────┬──────────────────────┘           │  │
│  │                   │ Mongoose ODM                      │  │
│  └───────────────────┼──────────────────────────────────┘  │
│                      │                                      │
│  ┌───────────────────┴──────────────────────────────────┐  │
│  │              MongoDB Atlas                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐           │  │
│  │  │  Users   │ │ShortURLs │ │ Analytics  │           │  │
│  │  └──────────┘ └──────────┘ └────────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Action** → React component calls API via Axios
2. **Axios Interceptor** → Attaches JWT token to `Authorization` header
3. **Express Router** → Routes request to appropriate controller
4. **Auth Middleware** → Verifies JWT and attaches user to request
5. **Controller** → Processes business logic with Mongoose models
6. **MongoDB** → Persists/retrieves data
7. **Response** → JSON response sent back to client

### Redirect Flow

1. User visits `http://localhost:5000/abc123`
2. Express catches `GET /:shortCode`
3. `redirectController` finds the URL by short code
4. User-agent is parsed for analytics (browser, device, OS)
5. Analytics event is recorded (fire-and-forget)
6. Click counter is incremented (fire-and-forget)
7. 302 redirect to original URL

---

## 📁 Folder Structure

```
url_shortener/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── urlController.js      # CRUD + bulk CSV upload
│   │   ├── analyticsController.js # Analytics aggregation
│   │   └── redirectController.js # Short URL redirect + tracking
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema + password hashing
│   │   ├── ShortUrl.js           # Short URL schema
│   │   └── Analytics.js          # Click analytics schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── urlRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── generateToken.js      # JWT token creation helper
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClickChart.jsx    # Recharts area chart
│   │   │   ├── CsvUpload.jsx     # CSV drag-and-drop upload
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   ├── ProtectedRoute.jsx# Auth guard wrapper
│   │   │   ├── QrCodeModal.jsx   # QR code display + download
│   │   │   ├── Sidebar.jsx       # Dashboard sidebar
│   │   │   ├── StatsCards.jsx    # Stat summary cards
│   │   │   ├── UrlForm.jsx       # URL create/edit form
│   │   │   └── UrlTable.jsx      # URL listing table
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── hooks/
│   │   │   └── useAuth.js        # Auth context hook
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx    # Login/register layout
│   │   │   └── DashboardLayout.jsx # Sidebar + content layout
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx # Per-URL analytics view
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Landing.jsx       # Public landing page
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx      # 404 page
│   │   │   ├── PublicStats.jsx   # Public stats view
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios instance + interceptors
│   │   ├── utils/
│   │   │   ├── copyToClipboard.js
│   │   │   └── formatDate.js
│   │   ├── App.jsx               # Root router
│   │   ├── index.css             # Tailwind + custom CSS
│   │   └── main.jsx              # React entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── AI_PLANNING_DOCUMENT.md
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **MongoDB** — Local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Git** ([download](https://git-scm.com))

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
```

### Step 2: Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account & cluster
3. Create a database user (username + password)
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Click **Connect** → **Connect your application**
6. Copy the connection string (replace `<password>` with your password)

### Step 3: Configure Environment Variables

**Backend** — Create `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=30d
PORT=5000
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000
NODE_ENV=development
```

**Frontend** — Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000
```

### Step 4: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 5: Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 6: Open in Browser

Visit **http://localhost:5173** — You should see the Sniplink landing page!

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable      | Description                              | Example                            |
|---------------|------------------------------------------|------------------------------------|
| `MONGO_URI`   | MongoDB connection string                | `mongodb+srv://user:pass@...`      |
| `JWT_SECRET`  | Secret key for signing JWTs              | `my-secret-key-2024`               |
| `JWT_EXPIRE`  | Token expiration duration                | `30d`                              |
| `PORT`        | Server port                              | `5000`                             |
| `CLIENT_URL`  | Frontend URL (for CORS)                  | `http://localhost:5173`            |
| `BASE_URL`    | Base URL for short links                 | `http://localhost:5000`            |
| `NODE_ENV`    | Environment mode                         | `development` or `production`      |

### Frontend (`frontend/.env`)

| Variable        | Description                    | Example                       |
|-----------------|--------------------------------|-------------------------------|
| `VITE_API_URL`  | Backend API endpoint           | `http://localhost:5000/api`   |
| `VITE_BASE_URL` | Base URL for displaying links  | `http://localhost:5000`       |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Auth | Description              |
|--------|----------------------|------|--------------------------|
| POST   | `/api/auth/register` | No   | Create new account       |
| POST   | `/api/auth/login`    | No   | Login & get JWT token    |
| GET    | `/api/auth/me`       | Yes  | Get current user profile |

### URL Management

| Method | Endpoint          | Auth | Description                 |
|--------|-------------------|------|-----------------------------|
| POST   | `/api/urls`       | Yes  | Create a short URL          |
| GET    | `/api/urls`       | Yes  | List user's URLs            |
| GET    | `/api/urls/:id`   | Yes  | Get single URL details      |
| PUT    | `/api/urls/:id`   | Yes  | Update destination URL      |
| DELETE | `/api/urls/:id`   | Yes  | Delete URL + analytics      |
| POST   | `/api/urls/bulk`  | Yes  | Bulk create from CSV        |

### Analytics

| Method | Endpoint                         | Auth | Description            |
|--------|----------------------------------|------|------------------------|
| GET    | `/api/analytics/:urlId`          | Yes  | Full URL analytics     |
| GET    | `/api/analytics/public/:code`    | No   | Public stats page data |

### Redirect

| Method | Endpoint          | Auth | Description               |
|--------|-------------------|------|---------------------------|
| GET    | `/:shortCode`     | No   | Redirect + track click    |

### Health Check

| Method | Endpoint       | Auth | Description       |
|--------|----------------|------|-------------------|
| GET    | `/api/health`  | No   | API status check  |

---

## 💾 Database Schema

### Users Collection
```javascript
{
  name: String,        // Required, max 50 chars
  email: String,       // Required, unique, lowercase
  password: String,    // Required, min 6 chars, bcrypt hashed
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

### ShortURLs Collection
```javascript
{
  userId: ObjectId,    // Reference to User
  originalUrl: String, // The long URL
  shortCode: String,   // Unique 8-char nanoid or custom alias
  customAlias: String, // Optional custom short code
  clicks: Number,      // Click counter (default: 0)
  expiryDate: Date,    // Optional expiration date
  qrCode: String,      // Base64 QR code data URI
  isActive: Boolean,   // Active status (default: true)
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection
```javascript
{
  urlId: ObjectId,     // Reference to ShortURL
  timestamp: Date,     // Click timestamp
  browser: String,     // Browser name (e.g., "Chrome")
  os: String,          // OS name (e.g., "Windows 10")
  device: String,      // "desktop", "mobile", "tablet"
  referrer: String,    // HTTP referrer or "Direct"
  ip: String           // Visitor IP address
}
```

---

## 🌐 Deployment

### Backend → Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
5. Add environment variables (same as `.env`, but with production values)
6. Set `BASE_URL` to your Render URL
7. Deploy!

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **Import Project**
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_BASE_URL` = `https://your-backend.onrender.com`
5. Deploy!

### Post-Deployment

- Update `CLIENT_URL` on Render to your Vercel URL
- Update CORS settings if needed
- Whitelist Render IPs in MongoDB Atlas

---

## 📸 Screenshots

> Add screenshots after running the project:
> 1. Landing page
> 2. Login page
> 3. Dashboard with URLs
> 4. Analytics page with charts
> 5. QR code modal
> 6. Mobile responsive view

---

## 🎬 Video Demo

> Record a 3-5 minute demo video showing:
> 1. Landing page walkthrough
> 2. User registration
> 3. Creating a short URL
> 4. Visiting the short URL (redirect)
> 5. Dashboard with click stats
> 6. Analytics page with charts
> 7. QR code generation & download
> 8. Custom alias feature
> 9. CSV bulk upload
> 10. Mobile responsive demo

**Upload to YouTube/Loom and paste the link here.**

---

## 🔮 Future Improvements

- [ ] Social login (Google, GitHub OAuth)
- [ ] Team/organization support
- [ ] Geographic analytics (IP geolocation)
- [ ] Custom branded domains
- [ ] Link click rate limiting
- [ ] API rate limiting
- [ ] Webhook integrations
- [ ] Link preview thumbnails (OpenGraph)
- [ ] Email notifications for milestones
- [ ] A/B testing with multiple destinations
- [ ] Progressive Web App (PWA) support
- [ ] Automated testing (Jest + Cypress)

---

## 📌 Assumptions

1. Users have a modern browser (Chrome, Firefox, Safari, Edge)
2. MongoDB Atlas free tier is sufficient for development/demo
3. Application is designed for demonstration/hackathon purposes
4. Short codes are 8 characters using nanoid (URL-safe alphabet)
5. QR codes are generated at 300px resolution
6. CSV uploads are limited to 100 URLs per file
7. Analytics data is not anonymized (development mode)
8. JWT tokens expire after 30 days
9. No email verification for signup (simplified for hackathon)

---

## 🤖 AI Planning Document

See [AI_PLANNING_DOCUMENT.md](./AI_PLANNING_DOCUMENT.md) for:
- Architecture decisions and rationale
- Feature planning and prioritization
- Database schema design process
- Technology selection criteria
- Development workflow

---

## 📤 GitHub Submission

### Git Commands

```bash
# Initialize git (in project root)
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: complete URL shortener with analytics"

# Create GitHub repository and push
# 1. Create repo on github.com
# 2. Add remote and push:
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git
git branch -M main
git push -u origin main
```

### .gitignore

Create a `.gitignore` file in the project root:
```
node_modules/
.env
dist/
.DS_Store
```

---

## 📝 License

This project is licensed under the MIT License.

---

This project is a part of a hackathon run by https://katomaran.com
