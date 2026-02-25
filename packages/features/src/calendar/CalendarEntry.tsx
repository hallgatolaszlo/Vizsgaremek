import CalendarEntryDetail from "@/src/components/CalendarPage/CalendarEntryDetail";
import CustomDialog from "@/src/components/CalendarPage/CustomDialog";
import { useProfileStore } from "@repo/hooks";
import { components } from "@repo/types";
import { getContrastFromHSLA } from "@repo/utils";
import { useState } from "react";
import { Card, Dialog, Text, Tooltip, useTheme } from "tamagui";

type GetCalendarEntryDTO = components["schemas"]["GetCalendarEntryDTO"];

interface CalendarEntryProps {
    entry: GetCalendarEntryDTO;
}

export function CalendarEntry({ entry }: CalendarEntryProps) {
    const currentTheme = useTheme();
    const theme = useTheme({ name: "calendarColors" });
    const backgroundColor = theme[`color${entry.color}`]?.val;
    const textColor = getContrastFromHSLA(backgroundColor);
    const { locale } = useProfileStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function entryText() {
        return entry.isAllDay
            ? entry.name
            : `${entry.name} (${new Date(entry.startDate!).toLocaleTimeString(
                  locale,
                  {
                      hour: "numeric",
                      minute: "2-digit",
                  },
              )} - ${new Date(entry.endDate!).toLocaleTimeString(locale, {
                  hour: "numeric",
                  minute: "2-digit",
              })})`;
    }

    return (
        <Card
            p={"$1"}
            pl={"$3"}
            m={"$1"}
            enterStyle={{ y: -10, opacity: 0 }}
            exitStyle={{ y: -10, opacity: 0 }}
            animation={"quickest"}
            style={{ backgroundColor }}
            className="entryCard"
            tabIndex={0}
            onPress={(e) => e.stopPropagation()}
        >
            <CustomDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                content={
                    <CalendarEntryDetail
                        entry={entry}
                        onClose={() => setIsDialogOpen(false)}
                    />
                }
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <Dialog.Trigger asChild>
                    <Text
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        color={textColor}
                    >
                        {entryText()}
                    </Text>
                </Dialog.Trigger>
            </CustomDialog>
        </Card>
    );
}
