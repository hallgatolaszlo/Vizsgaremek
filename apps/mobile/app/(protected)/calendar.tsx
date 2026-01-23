import { Calendar, ProtectedRoute } from "@repo/features";
import { useCalendarStore } from "@repo/hooks";

export default function CalendarPage() {
	const calendarStore = useCalendarStore();

	return (
		<ProtectedRoute>
			<Calendar calendarState={calendarStore} />
		</ProtectedRoute>
	);
}
