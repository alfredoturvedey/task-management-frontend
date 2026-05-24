import type { User } from "./auth.types";

export interface Project {
  id: string;
  name: string;
  description?: string;
  archived: boolean;
  owner: User;
  ownerId: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  archived?: boolean;
}

export interface AddMemberPayload {
  userId: string;
}
