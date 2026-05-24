import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { useUIStore } from "../../store/uiStore";
import TaskTable from "@/components/features/TaskTable";
import TaskForm from "@/components/forms/TaskForm";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import type { Task, TaskStatus, TaskPriority } from "../../types/task.types";

const TasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { dialogOpen, openDialog, closeDialog } = useUIStore();
  const {
    tasks,
    pagination,
    isLoading,
    fetchTasks,
    setPage,
    setLimit,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
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

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (user?.id) {
      await updateTaskStatus(user.id, taskId, status);
      // Recargar la página actual después de cambiar estado
      fetchTasks(
        user.id,
        projectId!,
        pagination.currentPage,
        pagination.itemsPerPage,
      );
    }
  };

  const handlePriorityChange = async (
    taskId: string,
    priority: TaskPriority,
  ) => {
    if (user?.id) {
      await updateTaskPriority(user.id, taskId, priority);
      // Recargar la página actual después de cambiar prioridad
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tareas del Proyecto
        </h1>
        <Button onClick={() => openDialog("newTask")}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>
      <TaskTable
        tasks={tasks}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      {/* New Task Dialog */}
      <Dialog
        open={dialogOpen.newTask}
        onOpenChange={(open) =>
          open ? openDialog("newTask") : closeDialog("newTask")
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Tarea</DialogTitle>
            <DialogDescription>
              Completa los detalles para crear una nueva tarea
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            projectId={projectId!}
            onSuccess={() => {
              closeDialog("newTask");
              if (user?.id && projectId) {
                fetchTasks(
                  user.id,
                  projectId,
                  pagination.currentPage,
                  pagination.itemsPerPage,
                );
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;
