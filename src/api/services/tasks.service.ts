import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  UpdateTaskStatusPayload,
  UpdateTaskPriorityPayload,
} from "../../types/task.types";
import { ApiPaginatedResponse } from "@/types/pagination.types";

export const tasksService = {
  async getAll(
    userId: string,
    projectId: string,
    page: number,
    limit: number,
  ): Promise<ApiPaginatedResponse<Task>> {
    const response = await axiosClient.get(
      ENDPOINTS.TASKS.LIST(userId, projectId, page, limit),
    );
    return response.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await axiosClient.get(ENDPOINTS.TASKS.DETAIL(id));
    return response.data;
  },

  async create(userId: string, payload: CreateTaskPayload): Promise<Task> {
    const response = await axiosClient.post(
      ENDPOINTS.TASKS.CREATE(userId),
      payload,
    );
    return response.data;
  },

  async update(
    userId: string,
    id: string,
    payload: UpdateTaskPayload,
  ): Promise<Task> {
    const response = await axiosClient.put(
      ENDPOINTS.TASKS.UPDATE(userId, id),
      payload,
    );
    return response.data;
  },

  async delete(userId: string, id: string): Promise<void> {
    await axiosClient.delete(ENDPOINTS.TASKS.DELETE(userId, id));
  },

  async updateStatus(
    userId: string,
    id: string,
    payload: UpdateTaskStatusPayload,
  ): Promise<Task> {
    const response = await axiosClient.put(
      ENDPOINTS.TASKS.UPDATE_STATUS(userId, id),
      payload,
    );
    return response.data;
  },

  async updatePriority(
    userId: string,
    id: string,
    payload: UpdateTaskPriorityPayload,
  ): Promise<Task> {
    const response = await axiosClient.put(
      ENDPOINTS.TASKS.UPDATE_PRIORITY(userId, id),
      payload,
    );
    return response.data;
  },
};
