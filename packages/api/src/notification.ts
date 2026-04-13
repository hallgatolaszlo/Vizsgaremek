import { components } from "@repo/types";
import { api } from "./api";

type GetFriendsDTOIEnumerableServiceResponse =
    components["schemas"]["GetFriendsDTOIEnumerableServiceResponse"];

export const sendFriendRequest = async (recipientId: string) => {
    const response = await api.post("api/friend-request", { recipientId });
    return response.data;
};

export const getFriends =
    async (): Promise<GetFriendsDTOIEnumerableServiceResponse> => {
        const response =
            await api.get<GetFriendsDTOIEnumerableServiceResponse>(
                "api/Friends",
            );
        return response.data;
    };
