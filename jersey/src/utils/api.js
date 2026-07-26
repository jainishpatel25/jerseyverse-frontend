import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      const user = JSON.parse(userInfo);

      if (user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;