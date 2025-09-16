import { apiCall } from "./category";

    export const getUserWishList = async (data:any) => apiCall(`/api/wishlist/user/${data?.userId}`, "GET", undefined, false);

    export const addWishList = async (userId: string, productId: string) => {
        return apiCall(`/api/wishlist/user/${userId}`, "POST", { productId }, false);
      };
      
    export const removeWishList = async (userId: string, productId: string) => apiCall(`/api/wishlist/user/${userId}`, "DELETE", {productId}, false);