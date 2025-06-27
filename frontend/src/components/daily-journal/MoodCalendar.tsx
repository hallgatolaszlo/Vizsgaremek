import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext/UseTheme";
import rootHexToRgb from "../../utils/rootHexToRGB";

interface MoodEntry {
    id: number;
    mood: number;
    created_at: string;
    journal_entry: string;
    author: string;
}

export default function MoodCalendar({
    data,
    onSelectEntry,
}: {
    data: MoodEntry[];
    onSelectEntry?: (entry: MoodEntry | null) => void;
}) {
    const { currentTheme } = useTheme();

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [entryMap, setEntryMap] = useState<Record<string, MoodEntry>>({});

    const todayStr = dayjs().format("YYYY-MM-DD");

    useEffect(() => {
        const map: Record<string, MoodEntry> = {};
        data.forEach((entry) => {
            const key = dayjs(entry.created_at).format("YYYY-MM-DD");
            map[key] = entry;
        });
        setEntryMap(map);

        handleDateChange(selectedDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        const key = date?.format("YYYY-MM-DD");

        if (key && entryMap[key]) {
            const entry = entryMap[key];
            onSelectEntry?.(entry);
        } else if (key === todayStr) {
            onSelectEntry?.(null);
        } else {
            onSelectEntry?.(null);
        }
    };

    const shouldDisableDate = (date: Dayjs) => {
        const key = date.format("YYYY-MM-DD");
        return !(entryMap[key] || key === todayStr);
    };

    return (
        <DateCalendar
            className="bg-color-2"
            key={currentTheme}
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={shouldDisableDate}
            slots={{
                day: (props) => {
                    const key = props.day.format("YYYY-MM-DD");
                    const entry = entryMap[key];

                    if (!entry) {
                        return <PickersDay {...props} />;
                    }

                    const mood = entry.mood;
                    const opacity = mood / 10;
                    const isSelected = props.selected;

                    const baseDayStyles = {
                        color: "var(--text-color-1)",
                        fontSize: "14px",
                        fontFamily: "var(--text-font)",
                        fontWeight: "bold",
                    };

                    return (
                        <PickersDay
                            {...props}
                            sx={{
                                ...baseDayStyles,
                                backgroundColor: `rgba(${rootHexToRgb(
                                    "--btn-color-1"
                                )}, ${opacity}) !important`,
                                borderRadius: "50%",
                                border: isSelected ? "1px solid black" : "none",
                                "&.MuiPickersDay-today": {
                                    ...baseDayStyles,
                                    border: isSelected
                                        ? "1px solid black"
                                        : "none",
                                },
                                "&.Mui-selected": {
                                    ...baseDayStyles,
                                },
                                "&:hover": {
                                    backgroundColor: isSelected
                                        ? "var(--btn-color-1)"
                                        : `rgba(${rootHexToRgb(
                                              "--btn-color-1"
                                          )}, ${Math.min(opacity + 0.25, 1)})`,
                                },
                            }}
                        />
                    );
                },
            }}
        />
    );
}
