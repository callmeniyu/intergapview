# InterGapView – AI-Powered Interview Report Generator

## 📝 Project Description

InterGapView is a full-stack web application that automates the creation of personalized interview preparation reports.

Candidates upload their resume as a PDF, provide a self-description, and paste a target job description. The system processes this information using Google's Gemini AI, validates the generated output against strict Zod schemas, and returns a structured interview preparation report containing:

- 🎯 Candidate-job match score (0–100)
- 💻 Technical interview questions with intended answers
- 🧠 Behavioral interview questions with intended answers
- 📊 Skill gaps rated by severity (`low` / `medium` / `high`)
- 📅 Day-by-day interview preparation plan

Generated reports are persisted in MongoDB and can be retrieved through a shareable URL.

The project demonstrates schema-driven AI output, full-stack form validation, PDF processing, database persistence, REST API design, and cloud deployment using Vercel and Render.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Multi-Step Onboarding** | Progressive flow: Upload resume → Paste job description → Add self-description with visual progress indicators |
| **PDF Resume Upload** | Client-side validation: PDF-only with a maximum file size of 3 MB |
| **Zod Validation** | Schema validation on both frontend and backend to ensure reliable structured data |
| **AI-Generated Reports** | Google Gemini generates structured interview reports in JSON format |
| **Skill Gap Analysis** | Automatically detects skill gaps and assigns `low`, `medium`, or `high` severity |
| **Preparation Plans** | Generates a day-by-day preparation plan containing focus areas and task arrays |
| **Report Persistence** | Complete input data and AI-generated output are stored in MongoDB using Mongoose |
| **Report Retrieval** | Reports can be retrieved individually by ID or fetched for the user |
| **Context API** | Global state management for loading states, reports, and application data |
| **Toast Notifications** | User-friendly success and error feedback |
| **Responsive UI** | Responsive interface with gradient backgrounds, floating shapes, animations, and grid-based layouts |
| **Axios Interceptor** | Centralized API error handling and user-friendly server error messages |

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, React Router, Axios, Zod, Lucide React |
| **State Management** | React Context API |
| **Styling** | Tailwind-inspired utility classes with custom design tokens |
| **Backend** | Node.js, Express, dotenv, CORS |
| **PDF Processing** | pdf-parse |
| **AI** | Google Gemini 1.5 Flash via Google GenAI SDK |
| **Validation** | Zod |
| **Database** | MongoDB + Mongoose |
| **API** | REST API |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Render |
| **Environment Management** | `.env`, Vercel Environment Variables, Render Environment Variables |

---

## 📦 Prerequisites

Before running the project, make sure you have:

- **Node.js 20+**
- npm, yarn, or pnpm
- Google Gemini API key with appropriate quota
- MongoDB Atlas account or local MongoDB instance
- Vercel account for frontend deployment
- Render account for backend deployment

---

## 🛠 Local Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/intergapview.git
cd intergapview
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
GEMINI_API_KEY=your_gemini_key_here
CORS_ORIGIN=http://localhost:5173
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/intergapview
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run Locally

Open two terminals.

**Terminal 1 – Backend**

```bash
cd server
npm run dev
```

Or:

```bash
node src/index.js
```

**Terminal 2 – Frontend**

```bash
cd client
npm run dev
```

Vite will typically start the frontend at:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/interview/report` | Private | Upload resume, job description, and self-description to generate and save an AI report |
| `GET` | `/api/interview/report/:id` | Private | Fetch a single report by MongoDB `_id` |
| `GET` | `/api/interview/reports` | Private | Fetch all reports belonging to the authenticated user |

### Create Report

**Endpoint**

```http
POST /api/interview/report
```

**Content-Type**

```text
multipart/form-data
```

**Request Fields**

| Field | Type | Description |
|---|---|---|
| `resume` | File | PDF resume, maximum 3 MB |
| `selfDescription` | String | Candidate's self-description |
| `jobDescription` | String | Target job description |

**Response**

Returns a JSON report object matching the backend `reportSchema`.

---

## 🧠 AI Pipeline

InterGapView uses a schema-driven AI generation pipeline to reduce unpredictable LLM responses.

### 1. Prompt Construction

The backend constructs the AI prompt using:

- Candidate resume text
- Candidate self-description
- Target job description
- System instructions defining the expected report structure

### 2. Resume Processing

The uploaded PDF is processed using `pdf-parse` to extract readable resume text.

### 3. Gemini AI Request

Google Gemini is called using structured JSON output requirements.

```text
Candidate Input
      │
      ├── Resume PDF
      ├── Self Description
      └── Job Description
              │
              ▼
       PDF Text Extraction
              │
              ▼
       Prompt Construction
              │
              ▼
         Gemini AI
              │
              ▼
       JSON Response
              │
              ▼
        JSON.parse()
              │
              ▼
       Zod Validation
              │
        ┌─────┴─────┐
        │           │
      Valid       Invalid
        │           │
        ▼           ▼
    Save DB       Error
        │
        ▼
   Return Report
```

### 4. Zod Validation

The raw Gemini response is parsed and validated against the backend report schema.

```text
Gemini JSON
    ↓
JSON.parse()
    ↓
reportSchema.parse()
    ↓
Validated Report
```

This ensures that the application does not blindly trust the AI-generated response.

### 5. Report Persistence

After successful validation, the report is stored in MongoDB using Mongoose.

---

## 📋 AI Report Structure

The generated report contains:

### Job Information

```text
jobTitle: string
matchScore: number (0–100)
```

### Technical Questions

```text
technicalQuestions: [
  {
    question: string,
    intention: string,
    answer: string
  }
]
```

### Behavioral Questions

```text
behavioralQuestions: [
  {
    question: string,
    intention: string,
    answer: string
  }
]
```

### Skill Gaps

```text
skillGaps: [
  {
    skill: string,
    severity: "low" | "medium" | "high"
  }
]
```

### Preparation Plans

```text
preparationPlans: [
  {
    day: number,
    focus: string,
    tasks: string[]
  }
]
```

If Gemini produces an invalid structure, Zod validation fails and the backend logs the validation issues instead of persisting malformed data.

Rate-limit (`429`) errors are also handled and converted into user-friendly API responses.

---

## 📁 Project Structure

```text
intergapview/
│
├── client/                         # Vite + React frontend
│   ├── src/
│   │   ├── features/
│   │   │   └── interview/          # Interview-specific pages, hooks, services
│   │   ├── contexts/               # InterviewContext
│   │   ├── components/             # Navbar, Footer, Loader, etc.
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/                         # Node.js + Express backend
│   ├── src/
│   │   ├── services/
│   │   │   └── ai.services.js      # Gemini AI logic
│   │   ├── controllers/
│   │   │   └── interviewReport.controller.js
│   │   ├── models/
│   │   │   └── report.model.js
│   │   ├── routes/
│   │   │   └── interview.routes.js
│   │   ├── index.js                 # Express entry point
│   │   └── ...
│   ├── package.json
│   └── .env
│
├── README.md
└── LICENSE
```

---

## 🔐 Validation & Error Handling

InterGapView uses validation at multiple layers.

### Frontend Validation

The frontend validates:

- Resume file type
- Resume file size
- Required form fields
- Input formats

### Backend Validation

The backend validates:

- Uploaded file
- Request payload
- AI-generated JSON
- MongoDB model data

### AI Output Validation

The generated response is validated using Zod before it is saved.

This creates a defensive pipeline:

```text
User Input
   ↓
Frontend Validation
   ↓
HTTP Request
   ↓
Backend Validation
   ↓
Gemini AI
   ↓
JSON Parsing
   ↓
Zod Schema Validation
   ↓
MongoDB
```

---

## ⚠️ Known Issues / Blockers

| Issue | Symptom | Status / Fix |
|---|---|---|
| **CORS Misconfiguration** | `CORS Missing Allow Origin` / `502` errors when calling the backend from the Vercel frontend | Ensure `cors()` middleware is configured and `CORS_ORIGIN` is correctly set on Render |
| **Build Output Directory** | Deployment platform expects `build/` while Vite generates `dist/` | Configure Vercel to use `dist` as the output directory |
| **Function Signature Mismatch** | `generateInterviewReport` previously threw `Missing required parameters` | Fixed by changing the function to accept `{ resumeText, selfDescription, jobDescription }` |
| **dotenv Loading Order** | `process.env.CORS_ORIGIN` resolved as `undefined` | Ensure `dotenv/config` is loaded before accessing environment variables |

### CORS Configuration

The backend should allow the deployed frontend origin:

```env
CORS_ORIGIN=https://intergapview-suw5.vercel.app
```

The value must exactly match the frontend origin.

---

## 🚀 Deployment

### Frontend — Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Select **Vite** as the framework preset.
4. Set the root directory to:

```text
client
```

5. Set the build command:

```bash
npm run build
```

6. Set the output directory:

```text
dist
```

7. Add the environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

8. Deploy.

---

### Backend — Render

Create a new **Web Service** on Render.

Configure:

```text
Runtime: Node.js
Root Directory: server
```

Add the following environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://intergapview-suw5.vercel.app
PORT=5000
```

Deploy the service.

The backend will be available at a URL similar to:

```text
https://intergapview-abc123.onrender.com
```

---

## 🔎 Post-Deployment Verification

After deployment, verify:

### 1. Frontend → Backend Communication

Ensure:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

### 2. CORS

The backend should return the correct:

```http
Access-Control-Allow-Origin
```

header matching the deployed Vercel frontend.

### 3. MongoDB

Verify that the Render server can connect to MongoDB Atlas and that the MongoDB network configuration allows the connection.

### 4. Gemini API

Verify that:

- `GEMINI_API_KEY` is configured
- The API key has sufficient quota
- Gemini requests successfully return structured JSON

### 5. End-to-End Flow

Test:

```text
Upload Resume
      ↓
Enter Job Description
      ↓
Enter Self Description
      ↓
Generate Report
      ↓
Gemini Processing
      ↓
Zod Validation
      ↓
MongoDB Persistence
      ↓
Report Display
```

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Candidate      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite UI   │
                    │       Vercel        │
                    └──────────┬──────────┘
                               │
                         Axios REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Express Backend    │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌──────────────┐
          │ PDF Parser │ │ Gemini AI  │ │     Zod      │
          │ pdf-parse  │ │            │ │  Validation  │
          └────────────┘ └─────┬──────┘ └──────┬───────┘
                               │               │
                               └───────┬───────┘
                                       ▼
                              ┌─────────────────┐
                              │    MongoDB      │
                              │     Atlas       │
                              └─────────────────┘
```

---

## 💡 Key Engineering Concepts Demonstrated

InterGapView demonstrates several practical full-stack engineering concepts:

- Full-stack React + Node.js architecture
- REST API design
- Multipart file uploads
- PDF text extraction
- AI/LLM integration
- Structured AI output
- Schema-driven development
- Zod validation
- Defensive AI response handling
- MongoDB data persistence
- Mongoose models
- React Context API
- Axios interceptors
- Centralized error handling
- Environment variable management
- CORS configuration
- Vercel deployment
- Render deployment
- MongoDB Atlas integration
- Responsive frontend development

---

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for the complete license terms.

---

## 👥 Acknowledgments / Notes

- AI generation is heavily constrained using Zod schemas to produce predictable and parseable output.
- Resume text is extracted using `pdf-parse`.
- Resume uploads are limited to **3 MB** to reduce processing time and prevent excessive resource usage.
- The application demonstrates an AI-mediated full-stack workflow:

```text
User Input
    ↓
Resume Processing
    ↓
LLM Generation
    ↓
Schema Validation
    ↓
Database Persistence
    ↓
Shareable Interview Report
```

The project is designed as a practical demonstration of integrating **generative AI into a production-style full-stack application**, rather than treating the LLM as an unvalidated black box.
