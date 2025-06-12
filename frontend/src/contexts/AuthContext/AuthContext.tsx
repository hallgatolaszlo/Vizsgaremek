import { createContext, type Dispatch, type SetStateAction } from "react";

interface AuthContext {
    isAuthorized: boolean;
    setIsAuthorized: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    verifyAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);
