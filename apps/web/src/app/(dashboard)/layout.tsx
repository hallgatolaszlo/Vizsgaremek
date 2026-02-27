"use client";

import { ProtectedRoute } from "@repo/features";
import { useCalendarStore, useNotificationStore } from "@repo/hooks";
import { useEffect } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { startConnection } = useNotificationStore();
	const initResizeListener = useCalendarStore(
		(state) => state.initResizeListener,
	);

	useEffect(() => {
		return initResizeListener();
	}, [initResizeListener]);

	useEffect(() => {
		console.log("starting connection");
		async function start() {
			await startConnection();
		}
		start();
	}, [startConnection]);

	return <ProtectedRoute>{children}</ProtectedRoute>;
}
