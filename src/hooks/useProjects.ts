import { useProjectStore } from "../store/projectStore";

export const useProjects = () => {
  const {
    projects,
    selectedProject,
    isLoading,
    error,
    pagination,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    clearError,
    setPage,
    setLimit
  } = useProjectStore();

  return {
    projects,
    selectedProject,
    isLoading,
    error,
    pagination,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    clearError,
    setPage,
    setLimit
  };
};
