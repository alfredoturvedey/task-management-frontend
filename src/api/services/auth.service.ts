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

  async changePassword(currentPassword: string, newPassword: string) {
    // TODO: Reemplazar con llamada real a la API
    // await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });

    // Simulación: si la contraseña actual es "password123" funciona
    if (currentPassword === "password123") {
      // Simular éxito
      return;
    } else {
      throw new Error("Contraseña actual incorrecta");
    }
  },
};
