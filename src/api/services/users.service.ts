import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { User } from "../../types/auth.types";

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await axiosClient.get(ENDPOINTS.USERS.LIST);
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await axiosClient.get(ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  },
};
