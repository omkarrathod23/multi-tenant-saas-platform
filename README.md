# 🚀 Ultimate Multi-Tenant SaaS Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

An enterprise-grade, high-performance **Multi-Tenant SaaS Platform** featuring schema-based isolation, real-time metrics, and a cutting-edge user experience.

---

## ✨ Features

### 💎 Ultra-Premium Experience
- **Futuristic UI**: Landing page designed with high-fidelity glassmorphism, animated mesh gradients, and sophisticated micro-interactions.
- **Responsive Dashboard**: Intelligent metrics tracking with real-time updates via WebSockets (STOMP).
- **AI Assistant**: Integrated smart assistant to help users navigate the platform and manage their business.

### 🛡️ Enterprise Architecture
- **Multi-Tenant Isolation**: Schema-per-tenant pattern ensuring 100% data segregation for maximum security and compliance.
- **Secure Authentication**: JWT-based identity management with role-based access control (RBAC).
- **Audit Logging**: Comprehensive activity tracking for all tenant operations.

### ☁️ Cloud-First Infrastructure
- **Serverless Database**: Powered by **Neon PostgreSQL** for seamless scaling and SSL-enforced security.
- **Dockerized Backend**: Java 17 Spring Boot backend containerized for deployment on **Render**.
- **Edge-Optimized Frontend**: React/TypeScript frontend deployed on **Vercel** for lightning-fast global delivery.

---

## 🛠️ Tech Stack

### Backend
- **Core**: Java 17, Spring Boot 3.2
- **Security**: Spring Security 6, JWT, BCrypt
- **Persistence**: Hibernate/JPA, HikariCP
- **Real-time**: Spring WebSocket (STOMP/SockJS)

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS + Custom Glassmorphic Tokens
- **State Management**: Redux Toolkit / React Context
- **API Client**: Axios with automatic tenant/JWT interceptors

---

## 🚀 Getting Started

### Prerequisites
- [JDK 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (or a [Neon.tech](https://neon.tech/) account)

### Local Implementation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/omkarrathod23/multi-tenant-saas-platform.git
   cd multi-tenant-saas-platform
   ```

2. **Backend Configuration**
   Create a `.env` in the root:
   ```env
   DATABASE_URL=jdbc:postgresql://your-neon-host/neondb?sslmode=require
   JWT_SECRET=your_32_character_long_secure_secret
   ```

3. **Frontend Configuration**
   Update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_WS_URL=http://localhost:8080/ws
   ```

4. **Launch Application**
   ```bash
   # Run Backend
   cd backend && mvn spring-boot:run

   # Run Frontend
   cd ../frontend && npm install && npm run dev
   ```

---

## 🌐 Production Deployment

### Backend (Render)
The project includes a multi-stage `Dockerfile` optimized for Spring Boot:
- **Port**: `8080` (dynamic binding via `${PORT}`)
- **Environment**: Ensure `DATABASE_URL` is set with the `jdbc:` prefix.

### Frontend (Vercel)
The frontend is pre-configured for SPA routing:
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **Routing**: Handled via `vercel.json` rewrites to `index.html`.

---

## 📊 Multi-Tenant Logic

This platform utilizes **Schema-Based Multi-Tenancy**. 
- The `master` schema manages global tenant metadata.
- On login, the system automatically resolves the tenant via the `X-TENANT-ID` header.
- Hibernate dynamic connection switching ensures the database session is restricted to the specific tenant schema for the duration of the request.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by the Multi-Tenant SaaS Team</p>
</div>

