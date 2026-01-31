"""
Healthcare AI Assistant Backend
A modern FastAPI application for healthcare test case generation and disease information.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Healthcare AI Assistant",
    description="AI-powered healthcare test case generation and disease information lookup",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Models
# ============================================================================

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = "healthy"
    timestamp: datetime = Field(default_factory=datetime.now)
    service: str = "Healthcare AI Backend"

class LoginRequest(BaseModel):
    """Login request model"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)

class SignupRequest(BaseModel):
    """Signup request model"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    full_name: Optional[str] = Field(None, max_length=100)

class UserResponse(BaseModel):
    """User response model"""
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    created_at: str = "2024-01-01"

class ChatRequest(BaseModel):
    """Chat/Gemini request model"""
    prompt: str = Field(..., min_length=5, max_length=2000)

class ChatResponse(BaseModel):
    """Chat/Gemini response model"""
    response: str
    timestamp: datetime = Field(default_factory=datetime.now)
    model: str = "healthcare-ai"

class TestCaseRequest(BaseModel):
    """Test case generation request"""
    requirement: str = Field(..., min_length=10, max_length=1000)
    system_type: str = Field(..., min_length=3, max_length=50)
    priority: str = Field(..., regex="^(low|medium|high|critical)$")
    compliance: List[str] = Field(default=["HIPAA"])

class TestCase(BaseModel):
    """Generated test case model"""
    title: str
    description: str
    priority: str
    compliance: List[str]
    test_steps: Optional[List[str]] = None

class TestCaseResponse(BaseModel):
    """Test case generation response"""
    test_cases: List[TestCase]
    requirement: str
    generated_at: datetime = Field(default_factory=datetime.now)

# ============================================================================
# Mock Database
# ============================================================================

USERS_DB = {
    "testuser": {
        "password": "password123",
        "email": "test@example.com",
        "full_name": "Test User"
    },
    "demo": {
        "password": "demo123",
        "email": "demo@healthcare.ai",
        "full_name": "Demo User"
    }
}

# ============================================================================
# Health & Status Endpoints
# ============================================================================

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "message": "Healthcare AI Assistant API",
        "status": "running",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    logger.info("Health check performed")
    return HealthResponse()

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def api_health_check():
    """API health check endpoint"""
    return HealthResponse(service="Healthcare AI API")

# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/api/auth/login", response_model=UserResponse, tags=["Authentication"])
async def login(request: LoginRequest):
    """User login endpoint"""
    logger.info(f"Login attempt for user: {request.username}")
    
    if request.username not in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    user = USERS_DB[request.username]
    if user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    logger.info(f"User {request.username} logged in successfully")
    return UserResponse(
        username=request.username,
        email=user.get("email"),
        full_name=user.get("full_name")
    )

@app.post("/api/auth/signup", response_model=UserResponse, tags=["Authentication"])
async def signup(request: SignupRequest):
    """User signup endpoint"""
    logger.info(f"Signup attempt for user: {request.username}")
    
    if request.username in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Add new user to mock database
    USERS_DB[request.username] = {
        "password": request.password,
        "email": request.email,
        "full_name": request.full_name or request.username
    }
    
    logger.info(f"User {request.username} signed up successfully")
    return UserResponse(
        username=request.username,
        email=request.email,
        full_name=request.full_name
    )

@app.get("/api/auth/user", response_model=UserResponse, tags=["Authentication"])
async def get_current_user():
    """Get current user (demo endpoint)"""
    return UserResponse(
        username="demo",
        email="demo@healthcare.ai",
        full_name="Demo User"
    )

@app.post("/api/auth/logout", tags=["Authentication"])
async def logout():
    """User logout endpoint"""
    logger.info("User logged out")
    return {"message": "Logged out successfully"}

# ============================================================================
# Disease & AI Endpoints
# ============================================================================

@app.post("/api/disease/chat", response_model=ChatResponse, tags=["Disease"])
async def chat_with_gemini(request: ChatRequest):
    """Chat with AI for disease information"""
    logger.info("Disease chat request received")
    
    try:
        # Mock response for demonstration
        response_text = generate_disease_response(request.prompt)
        
        logger.info("Disease chat response generated")
        return ChatResponse(
            response=response_text,
            model="healthcare-ai-gemini"
        )
    except Exception as e:
        logger.error(f"Error in disease chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing request"
        )

# ============================================================================
# Test Case Endpoints
# ============================================================================

@app.post("/api/testcase/generate", response_model=TestCaseResponse, tags=["Test Cases"])
async def generate_test_cases(request: TestCaseRequest):
    """Generate test cases for healthcare requirements"""
    logger.info(f"Test case generation request: {request.system_type}")
    
    try:
        test_cases = generate_test_cases_logic(
            request.requirement,
            request.system_type,
            request.priority,
            request.compliance
        )
        
        logger.info(f"Generated {len(test_cases)} test cases")
        return TestCaseResponse(
            test_cases=test_cases,
            requirement=request.requirement
        )
    except Exception as e:
        logger.error(f"Error generating test cases: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating test cases"
        )

# ============================================================================
# Utility Functions
# ============================================================================

def generate_disease_response(prompt: str) -> str:
    """Generate mock disease information"""
    disease_map = {
        "diabetes": """**Diabetes Mellitus**

**Brief Description:** Diabetes is a chronic condition affecting how the body processes blood sugar.

**Common Symptoms:**
- Frequent urination
- Increased thirst and hunger
- Extreme fatigue
- Slow-healing wounds
- Blurred vision

**Treatment Options:**
1. Lifestyle modifications (diet, exercise)
2. Medications (Metformin, Insulin)
3. Regular blood sugar monitoring
4. Healthcare provider consultation

**Prevention:** Maintain healthy weight, exercise regularly, eat balanced diet, manage stress.

**When to Seek Help:** If experiencing persistent symptoms or blood sugar levels are consistently high.""",
        
        "hypertension": """**Hypertension (High Blood Pressure)**

**Brief Description:** A condition where blood pressure remains abnormally high.

**Common Symptoms:**
- Often asymptomatic (silent killer)
- Headaches
- Dizziness
- Chest pain
- Shortness of breath

**Treatment Options:**
1. DASH diet and reduced salt
2. Regular exercise
3. Medications (ACE inhibitors, Beta-blockers)
4. Stress management

**Prevention:** Maintain healthy weight, limit alcohol, exercise regularly, manage stress.

**When to Seek Help:** Blood pressure consistently above 130/80 mmHg or experiencing severe symptoms.""",
        
        "asthma": """**Asthma**

**Brief Description:** A chronic respiratory disease causing inflammation and narrowing of airways.

**Common Symptoms:**
- Wheezing and coughing
- Shortness of breath
- Chest tightness
- Difficulty during physical activity

**Treatment Options:**
1. Quick-relief inhalers (Albuterol)
2. Long-term control medications
3. Avoiding triggers
4. Peak flow monitoring

**Prevention:** Identify triggers, take medications as prescribed, maintain healthy lifestyle.

**When to Seek Help:** Severe shortness of breath or blue lips/face."""
    }
    
    prompt_lower = prompt.lower()
    for disease, info in disease_map.items():
        if disease in prompt_lower:
            return info
    
    return """**General Health Information**

**About Your Query:** While specific information about your query is not available, here are general recommendations:

**General Health Tips:**
- Maintain regular exercise (150 mins/week)
- Eat balanced, nutritious meals
- Get 7-9 hours of sleep
- Manage stress through relaxation
- Stay hydrated
- Have regular medical check-ups
- Keep medications organized

**When to Consult a Doctor:**
- Persistent symptoms lasting >2 weeks
- Severe pain or discomfort
- Difficulty breathing or chest pain
- Sudden vision or hearing changes
- Signs of infection (fever, persistent cough)

**Always consult qualified healthcare professionals for proper diagnosis and treatment."""

def generate_test_cases_logic(
    requirement: str,
    system_type: str,
    priority: str,
    compliance: List[str]
) -> List[TestCase]:
    """Generate mock test cases"""
    
    base_test_cases = [
        {
            "title": f"Validate {system_type} System Access",
            "description": f"Verify that authorized users can access the {system_type} system with valid credentials.",
            "priority": priority,
            "compliance": compliance,
            "test_steps": [
                "Launch the application",
                "Enter valid credentials",
                "Click login button",
                "Verify successful access",
                "Check user dashboard displays correctly"
            ]
        },
        {
            "title": f"Test {system_type} Data Encryption",
            "description": "Ensure all patient data transmitted over network is encrypted using industry standards.",
            "priority": priority,
            "compliance": compliance,
            "test_steps": [
                "Capture network traffic",
                "Verify HTTPS/TLS usage",
                "Check encryption protocols (TLS 1.2+)",
                "Validate certificate validity",
                "Confirm no unencrypted PII transmission"
            ]
        },
        {
            "title": f"{system_type} User Authentication Test",
            "description": "Validate authentication mechanism prevents unauthorized access.",
            "priority": priority,
            "compliance": compliance,
            "test_steps": [
                "Attempt login with invalid credentials",
                "Verify error message (generic)",
                "Check account lockout after failed attempts",
                "Test password reset functionality",
                "Validate session timeout"
            ]
        },
        {
            "title": f"{system_type} Audit Log Verification",
            "description": "Ensure all user actions are logged for compliance and security audit trails.",
            "priority": priority,
            "compliance": compliance,
            "test_steps": [
                "Perform user actions in system",
                "Access audit logs",
                "Verify all actions are recorded",
                "Check timestamps are accurate",
                "Validate user identification in logs"
            ]
        }
    ]
    
    return [TestCase(**tc) for tc in base_test_cases]

# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    logger.error(f"HTTP Exception: {exc.detail}")
    return {
        "error": exc.detail,
        "status_code": exc.status_code,
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# Startup & Shutdown Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Application startup"""
    logger.info("=" * 60)
    logger.info("Healthcare AI Assistant Backend Starting...")
    logger.info("=" * 60)
    logger.info("API Documentation: http://localhost:8000/docs")
    logger.info("Health Check: http://localhost:8000/health")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown"""
    logger.info("Healthcare AI Assistant Backend Shutting Down...")

# ============================================================================
# Run the application
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
