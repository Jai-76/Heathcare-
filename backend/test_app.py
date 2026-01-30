from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db

app = FastAPI()
origins = ['http://localhost:5173', 'http://localhost:3000']
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.get('/')
def read_root():
    return {'message': 'Hello World'}

@app.get('/health')
def health_check():
    return {'status': 'healthy'}

@app.get('/test-db')
def test_db():
    try:
        from database import SessionLocal
        db = SessionLocal()
        db.close()
        return {'message': 'Database connection works'}
    except Exception as e:
        return {'error': str(e)}
