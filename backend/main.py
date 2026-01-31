from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Healthcare AI API')

# Configure CORS
# origins = [
#     'http://localhost:5173',  # Vite default
#     'http://localhost:3000',
#     'http://localhost:8000',
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=['*'],
#     allow_headers=['*'],
# )

@app.get('/')
def read_root():
    return {'message': 'Healthcare AI API'}

@app.get('/health')
def health_check():
    return {'status': 'healthy'}
