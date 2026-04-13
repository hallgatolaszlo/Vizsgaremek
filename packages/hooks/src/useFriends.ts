import { getFriends } from "@repo/api";
import { components } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

type GetFriendsDTO = components["schemas"]["GetFriendsDTO"];

export const useFriends = () =>
    useQuery<GetFriendsDTO[]>({
        queryKey: ["friends"],
        queryFn: async () => {
            const result = await getFriends();
            return result.data ?? [];
        },
        staleTime: 5 * 60 * 1000,
    });
