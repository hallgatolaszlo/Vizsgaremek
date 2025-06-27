import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import MoodCalendar from "../components/daily-journal/MoodCalendar.tsx";
import MoodSlider from "../components/daily-journal/MoodSlider.tsx";
import Hr from "../components/signin/Hr.tsx";
import SubmitButton from "../components/signin/SubmitButton.tsx";
import api from "../services/api.ts";

type DailyJournalFormInputs = {
    mood: number;
    journal_entry?: string;
};

interface MoodEntry {
    id: number;
    mood: number;
    created_at: string;
    journal_entry: string;
    author: string;
}

function DailyJournalPage(): JSX.Element {
    const [dailyJournals, setDailyJournals] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, control } =
        useForm<DailyJournalFormInputs>();

    useEffect(() => {
        getDailyJournals();
    }, []);

    const onSubmit = async (data: DailyJournalFormInputs) => {
        const mood = data.mood;
        const journal_entry = data.journal_entry ?? "";
        try {
            const res = await api.post("/api/user/daily-journals/list/", {
                mood,
                journal_entry,
            });
            getDailyJournals();
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    function getDailyJournals() {
        api.get("/api/user/daily-journals/list/")
            .then((res) => {
                setDailyJournals(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }

    const handleEntrySelect = (entry: MoodEntry | null) => {
        console.log("Parent received selected entry:", entry);
        if (entry) {
            reset({
                mood: entry.mood,
                journal_entry: entry.journal_entry,
            });
        } else {
            reset({
                mood: 1,
                journal_entry: "",
            });
        }
    };

    if (loading) {
        return <div>Loading</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="p-[25px] flex flex-col justify-center items-center bg-color-1 min-h-screen">
                <MoodCalendar
                    data={dailyJournals}
                    onSelectEntry={handleEntrySelect}
                />

                <div
                    style={{ border: "3px solid var(--btn-color-1)" }}
                    className="p-[25px] gap-7 flex flex-col items-center rounded-[20px] bg-color-2 w-full h-fit max-w-[500px] login-card"
                >
                    <h1 className="font-semibold text-center leading-[100%] title-font text-color-1 text-[46px]">
                        Daily Journal
                    </h1>
                    <div className="w-full">
                        <Hr />
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex items-center flex-col gap-[30px] max-w-[350px] w-full"
                    >
                        <div className="w-full flex flex-col gap-[10px]">
                            <Controller
                                name="mood"
                                control={control}
                                defaultValue={5}
                                render={({ field }) => (
                                    <MoodSlider
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <textarea
                            className="w-full min-h-[100px] text-font p-[10px] bg-[var(--soft-white)]"
                            placeholder="How was your day?"
                            {...register("journal_entry")}
                        ></textarea>
                        <div className="w-full flex justify-center">
                            <SubmitButton content="Submit"></SubmitButton>
                        </div>
                    </form>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default DailyJournalPage;
