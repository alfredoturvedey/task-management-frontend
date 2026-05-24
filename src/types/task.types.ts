import type { Project } from "./project.types";
import type { User } from "./auth.types";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: Project;
  projectId: string;
  assignedTo?: User | null;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  name: string;
  description?: string;
  priority?: TaskPriority;
  projectId: string;
  assignedToId: string;
}

export interface UpdateTaskPayload {
  name?: string;
  description?: string;
  priority?: TaskPriority;
  assignedToId?: string;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}

export interface UpdateTaskPriorityPayload {
  priority: TaskPriority;
}
