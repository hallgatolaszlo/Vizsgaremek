import { getProfile } from "@repo/api";
import { components } from "@repo/types";
import { useQuery } from "@tanstack/react-query";

type GetProfileDto = components["schemas"]["GetProfileDTO"];

export const useProfile = () => {
    return useQuery<GetProfileDto>({
        queryKey: ["profile"],
        queryFn: async () => {
            const profile = await getProfile();
            return profile;
        },
    });
};
