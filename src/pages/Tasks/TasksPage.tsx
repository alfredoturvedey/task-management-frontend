import { useEffect } from "react";
import { Plus } from "lucide-react";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import TaskCard from "../../components/features/TaskCard";
import Loader from "../../components/common/Loader";
import Alert from "../../components/common/Alert";
import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { TaskStatus, TaskPriority } from "../../types/task.types";
import { useUIStore } from "../../store/uiStore";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "../../components/common/Dialog";
import TaskForm from "../../components/forms/TaskForm";
import { useParams } from "react-router-dom";

const TasksPage = () => {
  const { user } = useAuth();
  const {
    filteredTasks,
    statusFilter,
    priorityFilter,
    isLoading,
    error,
    fetchTasks,
    setStatusFilter,
    setPriorityFilter,
  } = useTasks();
  const { dialogOpen, openDialog, closeDialog } = useUIStore();
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    if (user?.id && projectId) {
      fetchTasks(user.id, projectId);
    }
  }, [user?.id, projectId]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>
            <p className="text-muted-foreground">
              Administra todas tus tareas y su progreso
            </p>
          </div>
          <Button onClick={() => openDialog("newTask")}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Filtrar por Estado"
            options={[
              { value: "", label: "Todos" },
              { value: TaskStatus.PENDING, label: "Pendiente" },
              { value: TaskStatus.IN_PROGRESS, label: "En Progreso" },
              { value: TaskStatus.COMPLETED, label: "Completada" },
            ]}
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
          />

          <Select
            label="Filtrar por Prioridad"
            options={[
              { value: "", label: "Todas" },
              { value: TaskPriority.LOW, label: "Baja" },
              { value: TaskPriority.MEDIUM, label: "Media" },
              { value: TaskPriority.HIGH, label: "Alta" },
            ]}
            value={priorityFilter || ""}
            onChange={(e) =>
              setPriorityFilter(e.target.value as TaskPriority)
            }
          />
        </div>

        {/* Error */}
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Tasks Grid */}
        {isLoading ? (
          <Loader message="Cargando tareas..." />
        ) : filteredTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay tareas por mostrar
            </p>
            <Button onClick={() => openDialog("newTask")}>
              Crear tu primera tarea
            </Button>
          </div>
        )}
      </div>

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
            onSuccess={() => {
              closeDialog("newTask");
               if (user?.id && projectId) fetchTasks(user.id, projectId);
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TasksPage;
