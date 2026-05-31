import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

export const getInterviewRounds = (jobId) => api.get(`/jobs/${jobId}/interviews`);
export const addInterviewRound = (jobId, data) => api.post(`/jobs/${jobId}/interviews`, data);
export const updateInterviewRound = (jobId, roundId, data) => api.put(`/jobs/${jobId}/interviews/${roundId}`, data);
export const deleteInterviewRound = (jobId, roundId) => api.delete(`/jobs/${jobId}/interviews/${roundId}`);
