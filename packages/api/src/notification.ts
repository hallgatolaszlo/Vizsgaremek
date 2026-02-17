import { api } from "./api";

export const sendFriendRequest = async (recipientId: string) => {
    const response = await api.post("api/friend-request", { recipientId });
    return response.data;
};
