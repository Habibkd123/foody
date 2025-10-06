import { apiCall } from "./category";

export const getUserOrders = async (userId: any) => apiCall(`/api/orders/user/${userId}`, "GET", undefined, false);


