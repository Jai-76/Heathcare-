from fastapi import FastAPI, Form

app = FastAPI()

@app.get('/')
def read_root():
    return {'message': 'Hello World'}

@app.get('/health')
def health_check():
    return {'status': 'healthy'}

@app.post('/auth/signup')
def signup(email: str = Form(...), username: str = Form(...), password: str = Form(...)):
    return {'message': 'Signup successful', 'email': email, 'username': username}
