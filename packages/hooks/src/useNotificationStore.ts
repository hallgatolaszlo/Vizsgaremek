import { create } from "zustand";
import { isNative } from "@repo/utils";
import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../../api/src/nativeTokenStorage";
import { getBaseUrl } from "../../api/src/api";

interface AppNotification {
    id: string;
    type: string;
    message: string;
    sentAt: string;
}

interface NotificationStore {
    connection: signalR.HubConnection | null;
    notifications: AppNotification[];
    isConnected: boolean;
    startConnection: (token?: string) => Promise<void>;
}

const getSignalRToken = async () => {
    //native: accesstoken
    if (isNative()) {
        return await getAccessToken();
    }

    //web: null -> signalR automatically includes cookies
    return null;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    //null because there's no connection at start
    connection: null,
    notifications: [],
    isConnected: false,
    startConnection: async (token) => {
        const currentConnection = get().connection;
        //if connected, doesn't start a new one
        if (currentConnection?.state === signalR.HubConnectionState.Connected) {
            console.log("Already connected");
            set({ isConnected: true });
            return;
        }

        if (
            currentConnection?.state === signalR.HubConnectionState.Disconnected
        ) {
            try {
                await currentConnection.start();
                console.log("SignalR reconnected");
                set({ isConnected: true });
                return;
            } catch (err) {
                console.log(
                    "Failed to restart existing connection, creation new one",
                );
            }
        }

        const accessToken = token ?? (await getSignalRToken());

        const baseURL = getBaseUrl();
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseURL}/notifications`, {
                accessTokenFactory: () => accessToken ?? "",
            })
            .withAutomaticReconnect()
            .build();

        newConnection.on(
            "ReceiveNotification",
            (notification: AppNotification) => {
                console.log("Received notification: ", notification);
                set((state) => ({
                    notifications: [...state.notifications, notification],
                }));
            },
        );

        try {
            await newConnection.start();
            set({
                connection: newConnection,
                isConnected: true,
            });
            console.log("SignalR connected");
        } catch (err) {
            console.log(`SignalR connection error ${err}`);
        }
    },
}));
