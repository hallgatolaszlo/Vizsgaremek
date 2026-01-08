// Check if the environment is React Native
export function isNative(): boolean {
	return (
		typeof navigator !== "undefined" && navigator.product === "ReactNative"
	);
}
