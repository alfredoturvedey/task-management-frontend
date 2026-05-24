import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  updateTaskSchema,
  type CreateTaskFormData,
  type UpdateTaskFormData,
} from "../../validators/task.validators";
import { useProjects } from "../../hooks/useProjects";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/useAuth";
import {
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskPriority,
  Task,
} from "../../types/task.types";
import { usersService } from "../../api/services/users.service";
import type { User } from "../../types/auth.types";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import Alert from "../common/Alert";

interface TaskFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  projectId?: string;
  task?: Task | null;
}

const TaskForm = ({ onSuccess, onError, projectId, task }: TaskFormProps) => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { createTask, updateTask, isLoading, error, clearError } = useTasks();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const isEditing = !!task;

  // Cargar todos los usuarios del sistema
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const users = await usersService.getAll();
        setAllUsers(users);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData | UpdateTaskFormData>({
    resolver: zodResolver(isEditing ? updateTaskSchema : createTaskSchema),
    defaultValues: task
      ? {
          name: task.name,
          description: task.description || "",
          priority: task.priority,
          assignedToId: task.assignedToId || undefined,
        }
      : {
          projectId: projectId,
          priority: TaskPriority.MEDIUM,
          assignedToId: undefined,
        },
  });

  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        description: task.description || "",
        priority: task.priority,
        assignedToId: task.assignedToId || undefined,
      });
    }
  }, [task, reset]);

  const projectIdError =
    "projectId" in errors ? errors.projectId?.message : undefined;
  const assignedToError =
    "assignedToId" in errors ? errors.assignedToId?.message : undefined;

  const onSubmit = async (data: CreateTaskFormData | UpdateTaskFormData) => {
    try {
      setSubmitError(null);
      clearError();
      if (!user?.id) throw new Error("Usuario no autenticado");

      if (isEditing && task) {
        const payload: UpdateTaskPayload = {
          name: data.name,
          description: data.description,
          priority: data.priority,
          assignedToId: (data as UpdateTaskFormData).assignedToId,
        };
        await updateTask(user.id, task.id, payload);
      } else {
        const createData = data as CreateTaskFormData;
        const payload: CreateTaskPayload = {
          projectId: createData.projectId,
          name: createData.name,
          description: createData.description,
          priority: createData.priority,
          assignedToId: createData.assignedToId,
        };
        await createTask(user.id, payload);
      }

      if (!isEditing) {
        reset();
      }
      onSuccess?.();
    } catch (err: unknown) {
      const message: string =
        err instanceof Error
          ? err.message
          : isEditing
            ? "Error al actualizar tarea"
            : "Error al crear tarea";
      setSubmitError(message);
      onError?.(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(error || submitError) && (
        <Alert variant="destructive" onClose={clearError}>
          {error || submitError}
        </Alert>
      )}

      <Input
        label="Nombre de la Tarea"
        placeholder="Mi nueva tarea"
        {...register("name")}
        error={errors.name?.message}
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Descripción (Opcional)
        </label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Describe tu tarea..."
          {...register("description")}
        />
      </div>

      {!isEditing && (
        <Select
          label="Proyecto"
          options={projects.map((p) => ({ value: p.id, label: p.name }))}
          {...register("projectId")}
          error={projectIdError}
        />
      )}

      <Select
        label="Prioridad"
        options={[
          { value: TaskPriority.LOW, label: "Baja" },
          { value: TaskPriority.MEDIUM, label: "Media" },
          { value: TaskPriority.HIGH, label: "Alta" },
        ]}
        {...register("priority")}
      />

      <Select
        label="Asignado a (Opcional)"
        options={[
          { value: "", label: "Sin asignar" },
          ...allUsers.map((u) => ({
            value: u.id,
            label: `${u.name} ${u.lastName}`,
          })),
        ]}
        disabled={usersLoading}
        {...register("assignedToId")}
        error={assignedToError}
      />

      {usersLoading && (
        <p className="text-xs text-muted-foreground">Cargando usuarios...</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {isLoading
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
              ? "Actualizar Tarea"
              : "Crear Tarea"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
