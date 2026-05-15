<h1 align="center">
  🏥 MediCura
</h1>

<p align="center">
  <strong>Your AI-powered healthcare companion — book doctors, predict diseases, manage health records, and consult remotely.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/AI-HuggingFace-FFD21E?style=for-the-badge&logo=huggingface" />
  <img src="https://img.shields.io/badge/Hosted%20on-Render%20%2B%20Vercel-black?style=for-the-badge&logo=vercel" />
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | JWT-based signup / login with role-based access (Patient, Doctor, Admin) |
| 🩺 **Doctor Booking** | Browse, search & book appointments with verified doctors |
| 🤖 **AI Disease Prediction** | Predict possible conditions from symptoms using HuggingFace models |
| 📄 **EHR Upload** | Upload PDF health records — AI extracts labs, medications & insights |
| 📹 **Video Consultation** | Real-time video calls via Agora RTC |
| ⭐ **Reviews** | Patients can rate and review doctors post-appointment |
| 🛡️ **Admin Dashboard** | Manage users, subscriptions, and doctor approvals |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **Vite** — lightning-fast dev & build
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **Agora RTC SDK** — video consultations
- **React Toastify** — notifications

### Backend
- **Node.js** + **Express** — REST API server
- **Supabase** — PostgreSQL database + auth helpers
- **JWT** + **bcryptjs** — secure authentication
- **HuggingFace Inference API** — AI disease prediction
- **Multer** — file uploads
- **pdf-parse** — EHR document extraction

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) project
- A [HuggingFace](https://huggingface.co/settings/tokens) API token

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/MediCura.git
cd MediCura
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET_KEY=your_jwt_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
HF_TOKEN=hf_your_huggingface_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_preset
```

```bash
npm start
```

Backend runs at `http://localhost:5000`

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:5000/api/v1
VITE_CLOUD_NAME=your_cloud_name
VITE_UPLOAD_PRESET=your_preset
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Backend API | Render | `https://medicura-backend.onrender.com` |
| Frontend | Vercel | `https://medicura.vercel.app` |

### Deploy Backend → Render
1. Connect this repo on [Render](https://render.com)
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add all backend env vars in Render's environment settings

### Deploy Frontend → Vercel
1. Connect this repo on [Vercel](https://vercel.com)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Set `VITE_BASE_URL` to your Render backend URL

---

## 📁 Project Structure

```
MediCura/
├── backend/
│   ├── Auth/           # Auth middleware
│   ├── Controllers/    # Route controllers
│   ├── Routes/         # Express routes
│   ├── lib/            # Supabase client
│   ├── models/         # Data models
│   └── index.js        # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Reusable UI components
        ├── pages/      # Route-level pages
        ├── hooks/      # Custom React hooks
        └── config.js   # API base URL config
```

---

## 📝 License

MIT © Vidit Kumar Singh
