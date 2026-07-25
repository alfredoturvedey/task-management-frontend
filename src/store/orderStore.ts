// src/store/orderStore.ts
import { create } from "zustand";
import { OrderStore, Order } from "../types/order.types";
import { orderService } from "../api/services/order.service";

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrdersByUserId(userId);
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar las órdenes",
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrderById(orderId);
      set({ isLoading: false });
      return order;
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar la orden",
        isLoading: false,
      });
      return null;
    }
  },
}));
