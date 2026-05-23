import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../../types/auth.types";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },
};
