# 🤖 AI Planning Document — Sniplink URL Shortener

This document outlines the design decisions, planning details, architecture planning, and feature mapping for **Sniplink** — a modern full-stack URL Shortener with real-time analytics.

---

## 1. App Planning

### Problem Statement
In the modern digital workspace, long and complex URLs are difficult to share, track, and manage. Brands and developers need a simple, self-hosted, and high-performance URL shortening platform that provides deep analytic insights (such as device types, browser clients, and operating systems) while remaining secure, user-friendly, and lightweight.

### Target Audience
- Individual developers and content creators looking for custom short links.
- Social media managers needing click trends and traffic segmentation data.
- Businesses needing QR codes and downloadable media links.

---

## 2. Features & Prioritization

The application features were planned and developed in phases:

### Phase 1: Core Foundation (MVP)
- **Authentication**: User signup and login utilizing JSON Web Tokens (JWT) for stateless session handling and `bcryptjs` for secure password hashing.
- **Shortening**: Custom nanoid generator (8-character URL-safe tokens) for high entropy and low collision rates.
- **Redirection**: Instant wildcard Express redirect routing with MongoDB lookup.

### Phase 2: Analytics & Enhancements
- **Click Tracking**: Storing separate entries for every redirection click.
- **User-Agent Parsing**: Extracting Browser, Operating System (OS), and Device Type using `ua-parser-js` middleware.
- **Public Stats**: Anonymous page allowing creators to share limited click metrics publicly.

### Phase 3: Bonus Premium Features
- **Custom Aliases**: Allowing users to define branded paths (e.g., `/my-promo`).
- **QR Code Engine**: Base64 QR code generation on the fly for offline sharing and print media.
- **CSV Bulk Import**: Drag-and-drop CSV parser that processes up to 100 URL shortening tasks in a single request.
- **Link Expiration**: Expiring short URL lookups automatically after a specified user-selected datetime.

---

## 3. Architecture & Tech Stack

Sniplink uses a highly decoupled full-stack architecture:

- **Frontend**: Built with **React 18** and **Vite** for optimized development and lightning-fast bundle compilation. Styled with custom **Tailwind CSS** tokens using a dark glassmorphic SaaS color palette.
- **State & Routing**: Managed with **React Context API** (for auth) and **React Router DOM** (for SPA navigation).
- **Backend API**: **Node.js** + **Express.js** adhering to the traditional MVC controller-route-service pattern.
- **Data Persistence**: **MongoDB Atlas** utilizing Mongoose ODM for schema modeling and validation.
- **Visualization**: **Recharts** for SVG area charts tracking click distributions over time.
- **Animations**: **Framer Motion** for sleek sidebar layouts and page-transition animations.

---

## 4. Database Schema Design

### Users Collection
Stores authenticated user records.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcryptjs
  createdAt: Date,
  updatedAt: Date
}
```

### ShortURLs Collection
Stores shortened mappings, statistics summary, and metadata.
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: String },
  clicks: { type: Number, default: 0 },
  expiryDate: { type: Date },
  qrCode: { type: String }, // Base64 Data URL representation
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection
Tracks independent clicks for advanced traffic statistics.
```javascript
{
  urlId: { type: ObjectId, ref: 'ShortUrl', required: true },
  timestamp: { type: Date, default: Date.now },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  device: { type: String, default: 'desktop' },
  referrer: { type: String, default: 'Direct' },
  ip: { type: String }
}
```

---

## 5. Security & Performance Considerations

- **Password Hashing**: Bcrypt salt rounds set to 10 for balanced security and server performance.
- **JWT Protection**: Tokens are signed using `HS256` key and stored securely in local storage, refreshed seamlessly via Axios interceptors.
- **Database Indexes**: Indexing `shortCode` and `userId` fields to ensure fast $O(1)$ query speeds as link entries grow.
- **DNS Compatibility**: Constructed a legacy connection string targeting explicit MongoDB shard hosts to avoid DNS SRV ETIMEOUT network errors.
