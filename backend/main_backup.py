from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
# import google.generativeai as genai
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from database import get_db, User
from auth import verify_password, get_password_hash, create_access_token, verify_token
from typing import Optional, List

# Load environment variables
load_dotenv()

app = FastAPI(title='Healthcare AI API')

# Configure CORS (commented out for testing)
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

# OAuth2 scheme (commented out for now)
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Configure Gemini API (commented out for testing)
# api_key = os.getenv('GEMINI_API_KEY')
# if api_key:
#     genai.configure(api_key=api_key)
# else:
#     print("Warning: GEMINI_API_KEY not found in environment variables. Chat functionality will not work.")

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None

class TestCaseRequest(BaseModel):
    requirement: str
    systemType: str
    priority: str
    compliance: List[str]

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

# Dependency to get current user
# async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
async def get_current_user(token: str, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = verify_token(token)
    if username is None:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# Dependency to get current active user
async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.get('/')
def read_root():
    return {'message': 'Welcome to Healthcare AI Backend'}

@app.get('/health')
def health_check():
    return {'status': 'healthy'}

# Authentication endpoints
@app.post("/auth/signup")
def signup(data: dict):
    """Create a new user account"""
    return {"message": "Signup successful", "data": data}

@app.post("/auth/login", response_model=Token)
def login(form_data: dict):
    """Authenticate user and return access token"""
    from database import SessionLocal
    db = SessionLocal()
    try:
        username = form_data.get("username")
        password = form_data.get("password")
        
        if not username or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username and password required"
            )
        
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        db.close()

@app.get("/auth/me", response_model=UserResponse)
def read_users_me(token: str):
    """Get current user information"""
    from database import SessionLocal
    db = SessionLocal()
    try:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        username = verify_token(token)
        if username is None:
            raise credentials_exception
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
        return user
    finally:
        db.close()

@app.post('/chat')
def chat_with_gemini(request: ChatRequest, token: str):
    """Chat with Gemini AI (requires authentication)"""
    from database import SessionLocal
    db = SessionLocal()
    try:
        # Verify user is authenticated
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        username = verify_token(token)
        if username is None:
            raise credentials_exception
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        # Check if Gemini API is configured
        # if not os.getenv('GEMINI_API_KEY'):
        #     return {'error': 'GEMINI_API_KEY not configured. Please set your API key in the .env file.'}
        
        # try:
        #     model = genai.GenerativeModel('gemini-pro')
        #     response = model.generate_content(request.message)
        #     return {'response': response.text}
        # except Exception as e:
        #     return {'error': str(e)}
        return {'response': 'Gemini API not configured. Please set GEMINI_API_KEY in .env file.'}
    finally:
        db.close()

@app.post('/testcases/generate')
def generate_test_cases(request: TestCaseRequest, token: str):
    """Generate healthcare test cases using AI (requires authentication)"""
    from database import SessionLocal
    db = SessionLocal()
    try:
        # Verify user is authenticated
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        username = verify_token(token)
        if username is None:
            raise credentials_exception
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")

        # Check if Gemini API is configured
        # if not os.getenv('GEMINI_API_KEY'):
        #     return {'error': 'GEMINI_API_KEY not configured. Please set your API key in the .env file.'}
        
        # try:
        #     # Create prompt for test case generation
        #     prompt = f"""
        #     Generate comprehensive test cases for the following healthcare requirement:

        #     Requirement: {request.requirement}
        #     System Type: {request.systemType}
        #     Priority: {request.priority}
        #     Compliance Requirements: {', '.join(request.compliance)}

        #     Please generate 5-8 detailed test cases including:
        #     1. Test case title
        #     2. Description/scenario
        #     3. Preconditions
        #     4. Test steps
        #     5. Expected results
        #     6. Priority level
        #     7. Compliance considerations

        #     Format the response as a JSON array of test case objects with keys: title, description, preconditions, steps, expectedResults, priority, compliance.
        #     """

        #     model = genai.GenerativeModel('gemini-pro')
        #     response = model.generate_content(prompt)
            
        #     # Parse the response as JSON
        #     import json
        #     try:
        #     #     test_cases = json.loads(response.text)
        #     #     return {'testCases': test_cases}
        #     except json.JSONDecodeError:
        #         # If JSON parsing fails, return the raw response
        #         return {'testCases': [{'title': 'Generated Test Cases', 'description': response.text, 'priority': request.priority, 'compliance': request.compliance}]}
                
        # except Exception as e:
        #     return {'error': str(e)}
        return {'testCases': [{'title': 'Sample Test Case', 'description': 'This is a sample test case. Configure GEMINI_API_KEY to enable AI generation.', 'priority': request.priority, 'compliance': request.compliance}]}
    finally:
        db.close()
