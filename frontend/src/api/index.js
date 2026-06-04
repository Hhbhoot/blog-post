import axios from 'axios';
import config from '../config';

const http = axios.create({
  baseURL: config.api,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;
