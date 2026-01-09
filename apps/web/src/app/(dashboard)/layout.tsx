"use client";

import { ProtectedRoute } from "@repo/features";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ProtectedRoute>{children}</ProtectedRoute>;
}
