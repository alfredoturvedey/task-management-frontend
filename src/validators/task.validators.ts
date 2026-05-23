import { z } from "zod";
import { TaskPriority, TaskStatus } from "../types/task.types";

export const createTaskSchema = z.object({
  name: z
    .string({ error: "El nombre de la tarea es requerido" })
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  description: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  projectId: z.string({ error: "El proyecto es requerido" }),
});

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .partial();

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const updateTaskPrioritySchema = z.object({
  priority: z.nativeEnum(TaskPriority),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
