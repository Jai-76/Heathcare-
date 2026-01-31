from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
from dotenv import load_dotenv
# from database import get_db, User
# from auth import verify_password, get_password_hash, create_access_token, verify_token
from typing import Optional, List

# Load environment variables
load_dotenv()

app = FastAPI(title='Healthcare AI API')

# Configure CORS
origins = [
    'http://localhost:5173',  # Vite default
    'http://localhost:3000',
    'http://localhost:8000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TestCaseRequest(BaseModel):
    requirement: str
    systemType: str
    priority: str
    compliance: List[str]

# Mock authentication endpoints
@app.post("/auth/signup", response_model=UserResponse)
def signup(user: UserCreate):
    return {
        "id": 1,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "is_active": True
    }

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock login - accept any credentials
    access_token = "mock_token_" + form_data.username
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
def read_users_me():
    return {
        "id": 1,
        "email": "user@example.com",
        "username": "user",
        "full_name": "Test User",
        "is_active": True
    }

# Chat endpoint (mock response for now)
@app.post('/chat')
def chat_with_ai(request: ChatRequest):
    """Chat with AI (mock response)"""
    # Mock response for disease queries
    disease_responses = {
        'diabetes': """**Diabetes Mellitus**

**Description:** A chronic condition affecting blood sugar regulation.

**Symptoms:** Frequent urination, increased thirst, fatigue, slow-healing wounds.

**Treatment:** Lifestyle changes, medications (metformin), insulin therapy, regular monitoring.

**Prevention:** Healthy diet, exercise, weight management, regular check-ups.

**When to seek help:** Persistent high blood sugar, symptoms of complications.""",

        'hypertension': """**Hypertension (High Blood Pressure)**

**Description:** Elevated blood pressure that can damage arteries and organs.

**Symptoms:** Often asymptomatic, headaches, dizziness, chest pain.

**Treatment:** Lifestyle modifications, medications (ACE inhibitors, beta-blockers), regular monitoring.

**Prevention:** Healthy diet, reduced salt intake, exercise, stress management.

**When to seek help:** Blood pressure consistently above 130/80 mmHg.""",

        'asthma': """**Asthma**

**Description:** Chronic respiratory condition with airway inflammation.

**Symptoms:** Wheezing, coughing, shortness of breath, chest tightness.

**Treatment:** Inhalers (rescue and controller), avoiding triggers, asthma action plan.

**Prevention:** Identify triggers, take medications as prescribed, regular check-ups.

**When to seek help:** Severe breathing difficulty, blue lips, ineffective rescue inhaler."""
    }

    query = request.message.lower()
    for disease, response in disease_responses.items():
        if disease in query:
            return {'response': response}

    # Generic response
    return {'response': f"""**Health Information Request**

Thank you for your query about: "{request.message}"

**General Health Advice:**
- Consult healthcare professionals for personalized medical advice
- Maintain a healthy lifestyle with balanced diet and regular exercise
- Schedule regular health check-ups
- Keep track of symptoms and share them with your doctor

**Important:** This is general information. Please consult a qualified healthcare provider for specific medical concerns.

For more detailed information about specific conditions, try searching for common diseases like diabetes, hypertension, or asthma."""}

# Test cases endpoint (mock response)
@app.post('/testcases/generate')
def generate_test_cases(request: TestCaseRequest):
    """Generate test cases (mock response)"""
    return {
        'testCases': [{
            'title': f'Test Case for {request.systemType} - {request.requirement[:50]}...',
            'description': f'Validate {request.requirement.lower()}',
            'priority': request.priority,
            'compliance': request.compliance
        }]
    }

@app.get('/')
def read_root():
    return {'message': 'Healthcare AI API is running'}

@app.get('/health')
def health_check():
    return {'status': 'healthy'}
