import { useTaskStore } from "../store/taskStore";

export const useTasks = () => {
  const {
    tasks,
    filteredTasks,
    statusFilter,
    priorityFilter,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    setStatusFilter,
    setPriorityFilter,
    clearError,
  } = useTaskStore();

  return {
    tasks,
    filteredTasks,
    statusFilter,
    priorityFilter,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    setStatusFilter,
    setPriorityFilter,
    clearError,
  };
};
