[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jai-76/Heathcare-)

🏥 HealthTest AI – AI-Powered Healthcare Assistant

HealthTest AI is an intelligent healthcare solution that provides comprehensive disease information, treatment solutions, and automated test case generation for healthcare software. It leverages AI, Natural Language Processing (NLP), and machine learning to analyze requirements, generate test cases, and provide medical information with compliance standards such as HIPAA, GDPR, FDA 21 CFR Part 11, and ISO 13485.

This tool helps healthcare professionals, developers, and QA teams with disease information, treatment guidance, and ensures software quality through automated test case generation.

## 🚀 Features

🩺 Disease Information & Solutions – Get comprehensive information about diseases, symptoms, treatments, and prevention methods (currently using demo data).

💊 Medical AI Assistant – Interactive chat with AI for healthcare-related queries and guidance (requires GEMINI_API_KEY configuration).

📌 AI-Powered Requirement Analysis – Converts natural language healthcare requirements into test cases (requires GEMINI_API_KEY).

🛡️ Compliance Assurance – Auto-includes HIPAA, GDPR, FDA 21 CFR Part 11, and ISO standards in test cases.

📊 Traceability Matrix – Maps requirements to generated test cases for full audit readiness.

⚡ Priority Tagging – Automatically assigns criticality levels (Critical, High, Medium, Low).

🔗 Seamless Integrations – Export or push test cases to Jira, TestRail, Azure DevOps.

📥 Export Options – Download test cases in JSON, CSV, or PDF formats.

🔐 User Authentication – Secure signup and login system with JWT tokens.

🤖 Gemini AI Chat – Integrated chat functionality with Google's Gemini AI (requires API key).

🎨 Modern UI – React-based frontend with authentication and tabbed interface.

🏗️ Architecture Overview

Requirement Input – User enters healthcare requirement.

AI/NLP Engine – Parses requirement and identifies type (functional, security, privacy, compliance).

Test Case Generator – Produces test steps, expected outcomes, priority, and compliance tags.

Traceability Matrix – Links requirements to generated test cases.

Integrations – Export or push test cases to enterprise QA tools.

## 🏗️ Project Structure

```
healthcare-ai/
├── index.html              # Main HTML entry point with SEO and performance optimizations
├── src/
│   ├── main.jsx           # React application entry point
│   ├── App.jsx            # Main application component with routing
│   ├── index.css          # Global styles and Tailwind imports
│   ├── components/
│   │   ├── DiseaseLookup.jsx    # AI-powered disease information component
│   │   ├── TestCaseForm.jsx     # Healthcare test case generation
│   │   ├── LoginPage.jsx        # User authentication
│   │   └── SignupPage.jsx       # User registration
│   └── services/
│       └── api.js              # API client for backend communication
├── backend/
│   ├── main.py            # FastAPI backend server
│   ├── database.py        # Database models and connection
│   ├── auth.py            # Authentication utilities
│   └── requirements.txt   # Python dependencies
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Node.js dependencies and scripts
```

🖥️ Getting Started

## Prerequisites

- Node.js 16+ (for frontend development)
- Python 3.8+ (for backend API)
- npm or yarn package manager
- Modern browser (Chrome, Firefox, Edge, Safari)

## Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup (Optional - Frontend works with mock data)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables (optional)
# Create a .env file with:
# GEMINI_API_KEY=your_gemini_api_key_here
# SECRET_KEY=your-secret-key-here
# DATABASE_URL=sqlite:///./healthcare.db

# Start the backend server
python -m uvicorn main:app --host localhost --port 8000
```

The backend API will be available at `http://localhost:8000`

## 🚀 Available Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Backend Scripts
- `python main.py` - Run FastAPI server directly
- `uvicorn main:app --reload` - Run with auto-reload

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

## 🔧 Implementation Status

✅ **Backend Authentication System**
- User registration and login endpoints
- JWT token-based authentication
- Password hashing with bcrypt
- SQLite database with SQLAlchemy ORM

✅ **Frontend Authentication UI**
- React-based signup and login pages
- Authentication state management
- Protected routes and API calls

✅ **Gemini AI Integration**
- Chat endpoint for AI conversations
- Configurable API key management

⚠️ **Current Notes**
- The authentication system is fully implemented but may require debugging for production deployment
- Frontend uses inline Babel for JSX compilation (works in modern browsers)
- Database tables are created automatically on first run

Frontend Setup
# In a new terminal, navigate to project root
cd healthtest-ai

# Open index.html in your browser (it will automatically load React components)
# The frontend uses inline Babel compilation for JSX

📌 Roadmap

 Real AI-powered NLP integration (instead of simulated test cases)

 Multi-requirement support with batch test case generation

 Compliance-specific rule engine

 Advanced reporting & dashboard

🤝 Contributing

Contributions are welcome! Please fork the repo, create a branch, and submit a pull request.

📜 License

This project is licensed under the MIT License – feel free to use and modify.

📬 Contact

For questions or collaborations, reach out at:
📧 info@healthtestai.com

