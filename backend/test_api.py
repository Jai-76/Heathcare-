#!/usr/bin/env python3
"""
Test script for the Healthcare AI API
"""
import requests
import json
import subprocess
import time
import sys

BASE_URL = "http://localhost:8000"

def start_server():
    """Start the server in background"""
    try:
        process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
            cwd=".",
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        time.sleep(2)  # Wait for server to start
        return process
    except Exception as e:
        print(f"Failed to start server: {e}")
        return None

def stop_server(process):
    """Stop the server"""
    if process:
        process.terminate()
        process.wait()

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health endpoint working")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            print("✅ Root endpoint working")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_signup_endpoint():
    """Test the signup endpoint"""
    try:
        import time
        timestamp = str(int(time.time()))
        signup_data = {
            "email": f"test{timestamp}@example.com",
            "username": f"testuser{timestamp}",
            "password": "testpassword123",
            "full_name": "Test User"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Signup endpoint response: {response.status_code}")
        if response.status_code == 200:
            print("✅ Signup endpoint working")
            return True
        else:
            print(f"❌ Signup endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Signup endpoint error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint (requires authentication, so we'll skip for now)"""
    print("⚠️  Chat endpoint test skipped (requires authentication)")
    return True

if __name__ == "__main__":
    print("Testing Healthcare AI API...")
    print("=" * 40)

    # Start server
    server_process = start_server()
    if not server_process:
        print("❌ Could not start server")
        sys.exit(1)

    try:
        health_ok = test_health_endpoint()
        root_ok = test_root_endpoint()
        signup_ok = test_signup_endpoint()
        chat_ok = test_chat_endpoint()

        print("=" * 40)
        if health_ok and root_ok and signup_ok and chat_ok:
            print("🎉 API tests passed! Server is running correctly.")
            print("Note: Configure GEMINI_API_KEY in .env file for full functionality.")
        else:
            print("❌ Some tests failed. Check server logs.")
    finally:
        stop_server(server_process)