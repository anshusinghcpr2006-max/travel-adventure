# Voyage — Perfectly Planned Adventures

Voyage is a production-grade AI travel planning application built with **TanStack Start**, **Tailwind CSS v4**, and **Supabase**. It leverages advanced AI models via **Gemini API** to create personalized, high-fidelity travel itineraries in seconds.

## ✨ Features

- **🧠 Intelligent Planning:** Day-by-day and hour-by-hour itineraries tailored to your style (Budget, Luxury, Family, etc.).
- **🗺️ Interactive Maps:** Visualize your destination with Leaflet-powered interactive maps and automatic geocoding.
- **🔐 User Authentication:** Secure sign-up and login via Supabase Auth.
- **💾 Save & Sync:** Save your favorite itineraries to your profile and access them from any device.
- **📄 PDF Export:** Download professional PDF versions of your itineraries for offline access.
- **💬 AI Travel Assistant:** A context-aware chat agent to help you refine your plans in real-time.
- **🌦️ Weather-Aware:** Intelligent activity suggestions based on local weather outlooks.
- **🛫 Flight Search:** Integrated flight options for your travel dates.

## 🛠️ Tech Stack

- **Framework:** TanStack Start (React 19)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Database & Auth:** Supabase (PostgreSQL)
- **AI Integration:** Gemini API (gemini-1.5-flash)
- **Mapping:** Leaflet / OpenStreetMap
- **PDF Generation:** @react-pdf/renderer
- **Icons:** Lucide React

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/adventure-composer.git
cd adventure-composer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (optional, for caching)
VITE_SERPAPI_API_KEY=your_serpapi_key
```

### 4. Database Setup

Run the SQL provided in `SUPABASE_SCHEMA.md` in your Supabase SQL Editor.

### 5. Start Development

```bash
npm run dev
```

## 📄 License

MIT

---

Built with ❤️ by the Voyage Team.
