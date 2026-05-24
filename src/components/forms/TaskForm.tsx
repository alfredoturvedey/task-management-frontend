import { useEffect, useMemo } from "react";
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
import type { User } from "../../types/auth.types";
import type { Project } from "../../types/project.types";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import Alert from "../common/Alert";

interface TaskFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  projectId?: string;
  project?: Project | null;
  task?: Task | null;
}

const getTaskAssignedToId = (task?: Task | null) =>
  task?.assignedToId || task?.assignedTo?.id || "";

const getUserLabel = (user: User) =>
  [user.name, user.lastName].filter(Boolean).join(" ") || user.email;

const normalizeAssignedId = (value?: string) => value || undefined;

const uniqueUsers = (users: User[]) =>
  users.filter(
    (member, index, list) =>
      member && list.findIndex((item) => item.id === member.id) === index,
  );

const TaskForm = ({ onSuccess, onError, projectId, project, task }: TaskFormProps) => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { createTask, updateTask, isLoading, error, clearError } = useTasks();
  const isEditing = !!task;
  const assignedToId = getTaskAssignedToId(task);
  const activeProject = project || task?.project || projects.find((p) => p.id === projectId);
  const isOwner = activeProject?.ownerId === user?.id;

  const assignableUsers = useMemo(() => {
    const projectUsers = activeProject
      ? uniqueUsers([activeProject.owner, ...(activeProject.members ?? [])])
      : [];

    if (!isOwner) {
      return uniqueUsers([task?.assignedTo, user].filter(Boolean) as User[]);
    }

    if (task?.assignedTo && !projectUsers.some((item) => item.id === task.assignedTo?.id)) {
      return [task.assignedTo, ...projectUsers];
    }

    if (user && !projectUsers.some((item) => item.id === user.id)) {
      return [user, ...projectUsers];
    }

    return projectUsers;
  }, [activeProject, isOwner, task, user]);

  const defaultAssignedToId = isEditing
    ? assignedToId
    : isOwner
      ? assignableUsers[0]?.id || user?.id || ""
      : user?.id || "";

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
          assignedToId: defaultAssignedToId,
        }
      : {
          projectId,
          priority: TaskPriority.MEDIUM,
          assignedToId: defaultAssignedToId,
        },
  });

  useEffect(() => {
    if (task) {
      reset({
        name: task.name,
        description: task.description || "",
        priority: task.priority,
        assignedToId: getTaskAssignedToId(task),
      });
      return;
    }

    reset({
      projectId,
      priority: TaskPriority.MEDIUM,
      assignedToId: defaultAssignedToId,
    });
  }, [defaultAssignedToId, projectId, reset, task]);

  const projectIdError =
    "projectId" in errors ? errors.projectId?.message : undefined;
  const assignedToError =
    "assignedToId" in errors ? errors.assignedToId?.message : undefined;

  const onSubmit = async (data: CreateTaskFormData | UpdateTaskFormData) => {
    try {
      clearError();
      if (!user?.id) throw new Error("Usuario no autenticado");

      if (isEditing && task) {
        const payload: UpdateTaskPayload = {
          name: data.name,
          description: data.description,
          priority: data.priority,
          assignedToId: normalizeAssignedId(
            (data as UpdateTaskFormData).assignedToId,
          ),
        };
        await updateTask(user.id, task.id, payload);
      } else {
        const createData = data as CreateTaskFormData;
        const selectedAssignedToId = normalizeAssignedId(createData.assignedToId);

        if (!selectedAssignedToId) {
          throw new Error("El usuario asignado es requerido");
        }

        const payload: CreateTaskPayload = {
          projectId: createData.projectId,
          name: createData.name,
          description: createData.description,
          priority: createData.priority,
          assignedToId: selectedAssignedToId,
        };
        await createTask(user.id, payload);
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
      onError?.(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive" onClose={clearError}>
          {error}
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
          Descripcion (Opcional)
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
        label="Asignado a"
        options={assignableUsers.map((assignableUser) => ({
          value: assignableUser.id,
          label: getUserLabel(assignableUser),
        }))}
        {...register("assignedToId")}
        error={assignedToError}
      />
      {!isOwner && (
        <p className="text-xs text-muted-foreground">
          Las tareas creadas por miembros se asignan al usuario autenticado.
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? "Actualizar Tarea" : "Crear Tarea"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
