import { useProjectStore } from "../store/projectStore";

export const useProjects = () => {
  const {
    projects,
    selectedProject,
    isLoading,
    error,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    clearError,
  } = useProjectStore();

  return {
    projects,
    selectedProject,
    isLoading,
    error,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    clearError,
  };
};
