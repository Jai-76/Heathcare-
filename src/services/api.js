// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

class HealthTestAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await this.client.post('/auth/refresh', {
      refresh_token: refreshToken
    });

    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  }

  // Project methods
  async getProjects(params = {}) {
    const response = await this.client.get('/projects', { params });
    return response.data;
  }

  async createProject(projectData) {
    const response = await this.client.post('/projects', projectData);
    return response.data;
  }

  // Requirement analysis
  async analyzeRequirement(data) {
    const response = await this.client.post('/requirements/analyze', data);
    return response.data;
  }

  // Test case generation
  async generateTestCases(data) {
    const response = await this.client.post('/testcases/generate', data);
    return response.data;
  }

  // Integration exports
  async exportToJira(data) {
    const response = await this.client.post('/integrations/jira/export', data);
    return response.data;
  }

  async exportToTestRail(data) {
    const response = await this.client.post('/integrations/testrail/export', data);
    return response.data;
  }

  async exportToAzureDevOps(data) {
    const response = await this.client.post('/integrations/azuredevops/export', data);
    return response.data;
  }
}

export default new HealthTestAPI();
