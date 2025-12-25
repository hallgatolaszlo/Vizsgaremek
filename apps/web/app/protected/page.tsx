"use client";

import { useAuthStore } from "../_hooks/useAuthStore";
import UnauthorizedPage from "../pages/401";

export default function ProtectedPage() {
	const isAuthorized = useAuthStore((state) => state.isAuthorized);

	if (!isAuthorized) {
		return <UnauthorizedPage></UnauthorizedPage>;
	}

	return <div>Protected Page - Authorized Users Only</div>;
}
