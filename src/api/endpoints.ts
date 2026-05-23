// URLs base y endpoints de la API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },

  // Projects
  PROJECTS: {
    LIST: (userId: string) => `/api/projects/${userId}`,
    CREATE: "/api/projects",
    DETAIL: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (userId: string, id: string) => `/api/projects/${userId}/${id}`,
    ADD_MEMBER: (userId: string, id: string) =>
      `/api/projects/${userId}/${id}/members`,
    REMOVE_MEMBER: (userId: string, id: string, memberId: string) =>
      `/api/projects/${userId}/${id}/members/${memberId}`,
  },

  // Tasks
  TASKS: {
    LIST: (userId: string, projectId: string) => `/api/tasks/${userId}/${projectId}`,
    CREATE: (userId: string) => `/api/tasks/${userId}`,
    DETAIL: (id: string) => `/api/tasks/${id}`,
    UPDATE: (userId: string, id: string) => `/api/tasks/${userId}/${id}`,
    DELETE: (userId: string, id: string) => `/api/tasks/${userId}/${id}`,
    UPDATE_STATUS: (userId: string, id: string) =>
      `/api/tasks/${userId}/${id}/status`,
    UPDATE_PRIORITY: (userId: string, id: string) =>
      `/api/tasks/${userId}/${id}/priority`,
  },
};
