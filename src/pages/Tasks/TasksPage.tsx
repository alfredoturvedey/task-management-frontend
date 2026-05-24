import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
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
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import MainLayout from "@/components/layout/MainLayout";
import type { Task, TaskStatus, TaskPriority } from "../../types/task.types";

const TasksPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const { dialogOpen, openDialog, closeDialog, editingTask, setEditingTask } =
    useUIStore();
  const { projects, fetchProjectById } = useProjects();
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

  // Obtener el proyecto actual
  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId, fetchProjectById]);

  const currentProject = projects.find((p) => p.id === projectId);

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
    setEditingTask(task);
    openDialog("editTask");
  };

  const confirmDeleteTask = async () => {
    if (user?.id && taskToDeleteId && projectId) {
      await deleteTask(user.id, taskToDeleteId);
      setTaskToDeleteId(null);
      fetchTasks(
        user.id,
        projectId,
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tareas del Proyecto
            </h1>
            {currentProject && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentProject.name}
              </p>
            )}
          </div>
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
          onDelete={setTaskToDeleteId}
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

        {/* Edit Task Dialog */}
        <Dialog
          open={dialogOpen.editTask}
          onOpenChange={(open) =>
            open ? openDialog("editTask") : closeDialog("editTask")
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tarea</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la tarea
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              task={editingTask}
              onSuccess={() => {
                closeDialog("editTask");
                setEditingTask(null);
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

        <ConfirmAlertDialog
          open={!!taskToDeleteId}
          onOpenChange={(open) => !open && setTaskToDeleteId(null)}
          title="Eliminar tarea"
          description="Esta accion eliminara la tarea seleccionada. Deseas continuar?"
          confirmText="Eliminar tarea"
          onConfirm={confirmDeleteTask}
        />
      </div>
    </MainLayout>
  );
};

export default TasksPage;
