export type Theme = {
    "bg-color-1": string;
    "bg-color-2": string;
    "btn-color-1": string;
    "text-color-1": string;
    "text-color-2": string;
};

export const themes: Record<string, Theme> = {
    darkBlue: {
        "bg-color-1": "#1e2a38",
        "bg-color-2": "#2f3e50",
        "btn-color-1": "#557a95",
        "text-color-1": "#c5cfdf",
        "text-color-2": "#8a9ba8",
    },
    darkGreen: {
        "bg-color-1": "#1F2E2E",
        "bg-color-2": "#39504B",
        "btn-color-1": "#587366",
        "text-color-1": "#c8d9d1",
        "text-color-2": "#849D94",
    },
    lightLavender: {
        "bg-color-1": "#dbd4e4",
        "bg-color-2": "#cac6df",
        "btn-color-1": "#8886d0",
        "text-color-1": "#4A4763",
        "text-color-2": "#8B87A3",
    },
    lightSand: {
        "bg-color-1": "#F8F4EB",
        "bg-color-2": "#D9D3C7",
        "btn-color-1": "#B17A64",
        "text-color-1": "#4B3B2B",
        "text-color-2": "#8C7B69",
    },
};
