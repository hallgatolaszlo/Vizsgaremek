"use client";

import { ProtectedRoute } from "@repo/features";
import { useNotificationStore } from "@repo/hooks";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { startConnection, isConnected } = useNotificationStore();

    useEffect(() => {
        console.log("starting connection");
        async function start() {
            await startConnection();
        }
        start();
    }, []);

    return <ProtectedRoute>{children}</ProtectedRoute>;
}
