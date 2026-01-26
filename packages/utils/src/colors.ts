type ContrastColor = "black" | "white";

/**
 * Determines contrast based on an HSLA string.
 * Supports: "hsla(210, 50%, 50%, 1)" or "hsl(210 50% 50%)"
 */
export const getContrastFromHSLA = (hslaString: string): ContrastColor => {
	// Regex to extract numbers/percentages
	const match = hslaString.match(/\d+(\.\d+)?/g);

	if (!match || match.length < 3) {
		throw new Error("Invalid HSLA string format");
	}

	const h = parseFloat(match[0]);
	const s = parseFloat(match[1]) / 100;
	const l = parseFloat(match[2]) / 100;

	// Convert HSL to RGB to get accurate perceived brightness
	// Because "L" doesn't account for hue-based luminance.
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(color * 255);
	};

	const r = f(0);
	const g = f(8);
	const b = f(4);

	// Apply YIQ brightness formula
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness > 128 ? "black" : "white";
};
