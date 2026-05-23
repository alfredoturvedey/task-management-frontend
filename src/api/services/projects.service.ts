import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  AddMemberPayload,
} from "../../types/project.types";

export const projectsService = {
  async getAll(userId: string): Promise<Project[]> {
    const response = await axiosClient.get(ENDPOINTS.PROJECTS.LIST(userId));
    return response.data;
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
