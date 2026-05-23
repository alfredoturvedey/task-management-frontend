import { create } from "zustand";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "../types/project.types";
import { projectsService } from "../api/services/projects.service";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: (userId: string) => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (payload: CreateProjectPayload) => Promise<Project>;
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<void>;
  deleteProject: (userId: string, id: string) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectsService.getAll(userId);
      set({ projects, isLoading: false });
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al cargar proyectos",
        isLoading: false,
      });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectsService.getById(id);
      set({ selectedProject: project, isLoading: false });
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al cargar proyecto",
        isLoading: false,
      });
    }
  },

  createProject: async (payload: CreateProjectPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectsService.create(payload);
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
      return newProject;
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al crear proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: string, payload: UpdateProjectPayload) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await projectsService.update(id, payload);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p)),
        selectedProject:
          state.selectedProject?.id === id ? updated : state.selectedProject,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al actualizar proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (userId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectsService.delete(userId, id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al eliminar proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),

  clearError: () => set({ error: null }),
}));
