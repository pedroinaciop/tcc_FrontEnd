import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api", 
});

export const SetupAxiosInterceptors = () => {

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.error("Erro de autenticação:", error);
      }
      return Promise.reject(error);
    }
  );
};

export default api;