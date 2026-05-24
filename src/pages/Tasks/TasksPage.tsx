import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import TaskTable from "@/components/features/TaskTable";
import type { Task } from "../../types/task.types";

const TasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const {
    tasks,
    pagination,
    isLoading,
    fetchTasks,
    setPage,
    setLimit,
    deleteTask,
  } = useTasks();

  // Cargar tareas cuando cambie el proyecto, la página o el límite
  useEffect(() => {
    if (user?.id && projectId) {
      fetchTasks(
        user.id,
        projectId,
        pagination.currentPage,
        pagination.itemsPerPage,
      );
    }
  }, [
    user?.id,
    projectId,
    pagination.currentPage,
    pagination.itemsPerPage,
    fetchTasks,
  ]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  const handleEdit = (task: Task) => {
    // Aquí puedes abrir un modal para editar la tarea
    console.log("Editar tarea", task);
  };

  const handleDelete = async (taskId: string) => {
    if (user?.id && confirm("¿Eliminar esta tarea?")) {
      await deleteTask(user.id, taskId);
      // Recargar la página actual después de eliminar
      fetchTasks(
        user.id,
        projectId!,
        pagination.currentPage,
        pagination.itemsPerPage,
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Tareas del Proyecto
      </h1>
      <TaskTable
        tasks={tasks}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TasksPage;
