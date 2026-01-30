🏥 HealthTest AI – AI-Powered Healthcare Test Case Generation

HealthTest AI is an intelligent solution that transforms healthcare software requirements into structured, compliant, and traceable test cases. It leverages AI, Natural Language Processing (NLP), and machine learning to analyze requirements, generate test steps, assign priorities, and embed compliance standards such as HIPAA, GDPR, FDA 21 CFR Part 11, and ISO 13485.

This tool helps healthcare teams reduce manual effort, improve accuracy, and accelerate test coverage while ensuring compliance with international healthcare regulations.

## 🚀 Features

📌 AI-Powered Requirement Analysis – Converts natural language healthcare requirements into test cases.

🛡️ Compliance Assurance – Auto-includes HIPAA, GDPR, FDA 21 CFR Part 11, and ISO standards in test cases.

📊 Traceability Matrix – Maps requirements to generated test cases for full audit readiness.

⚡ Priority Tagging – Automatically assigns criticality levels (Critical, High, Medium, Low).

🔗 Seamless Integrations – Export or push test cases to Jira, TestRail, Azure DevOps.

📥 Export Options – Download test cases in JSON, CSV, or PDF formats.

🔐 User Authentication – Secure signup and login system with JWT tokens.

🤖 Gemini AI Chat – Integrated chat functionality with Google's Gemini AI.

🎨 Modern UI – React-based frontend with authentication pages.

🏗️ Architecture Overview

Requirement Input – User enters healthcare requirement.

AI/NLP Engine – Parses requirement and identifies type (functional, security, privacy, compliance).

Test Case Generator – Produces test steps, expected outcomes, priority, and compliance tags.

Traceability Matrix – Links requirements to generated test cases.

Integrations – Export or push test cases to enterprise QA tools.

📂 Project Structure
├── index.html        # Frontend interface with TailwindCSS
├── script.js         # Core logic for test case generation
├── styles.css        # Custom styling and UI components
├── /assets           # Images, icons, mock diagrams
└── README.md         # Documentation

🖥️ Getting Started
Prerequisites

Node.js (for local development)
Python 3.8+ (for backend API)
A modern browser (Chrome, Firefox, Edge)

Backend Setup

# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file in the backend directory with:
# GEMINI_API_KEY=your_gemini_api_key_here
# SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
# DATABASE_URL=sqlite:///./healthcare.db

# The database will be created automatically when you first run the server

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

