import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  AddMemberPayload,
} from "../../types/project.types";
import { PaginatedResponse } from "@/types/pagination.types";

export const projectsService = {
  async getAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Project>> {
    const response = await axiosClient.get(
      ENDPOINTS.PROJECTS.LIST(userId, page, limit),
    );
    // Asumimos que la API devuelve la paginación directamente en la respuesta
    // Si la estructura es { data: [...], meta: {...} }, usamos eso
    // Si la estructura es { data: [...], total: ..., page: ..., limit: ..., totalPages: ... }, extraemos esos campos
    const responseData = response.data;
    const projects = responseData.data || responseData;
    const totalItems =
      responseData.total || responseData.meta?.totalItems || projects.length;
    const totalPages =
      responseData.totalPages ||
      responseData.meta?.totalPages ||
      Math.ceil(totalItems / limit);

    return {
      data: projects,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages || 1, // Evitar NaN
        hasNextPage: page < (totalPages || 1),
        hasPrevPage: page > 1,
      },
    };
  },

  async getById(id: string): Promise<Project> {
    const response = await axiosClient.get(ENDPOINTS.PROJECTS.DETAIL(id));
    return response.data;
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    const response = await axiosClient.post(ENDPOINTS.PROJECTS.CREATE, payload);
    return response.data;
  },

  async update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const response = await axiosClient.put(
      ENDPOINTS.PROJECTS.UPDATE(id),
      payload,
    );
    return response.data;
  },

  async delete(userId: string, id: string): Promise<void> {
    await axiosClient.delete(ENDPOINTS.PROJECTS.DELETE(userId, id));
  },

  async addMember(
    userId: string,
    projectId: string,
    payload: AddMemberPayload,
  ): Promise<Project> {
    const response = await axiosClient.post(
      ENDPOINTS.PROJECTS.ADD_MEMBER(userId, projectId),
      payload,
    );
    return response.data;
  },

  async removeMember(
    userId: string,
    projectId: string,
    memberId: string,
  ): Promise<void> {
    await axiosClient.delete(
      ENDPOINTS.PROJECTS.REMOVE_MEMBER(userId, projectId, memberId),
    );
  },
};
