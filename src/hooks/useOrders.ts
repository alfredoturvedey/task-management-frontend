// src/hooks/useOrders.ts
import { useOrderStore } from "../store/orderStore";

export const useOrders = () => {
  const { orders, isLoading, error, fetchOrders, fetchOrderById } =
    useOrderStore();

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
  };
};
