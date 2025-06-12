import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { type JSX } from "react";
import { useForm } from "react-hook-form";
import MoodSlider from "../components/daily-journal/MoodSlider.tsx";
import Hr from "../components/signin/Hr.tsx";
import SubmitButton from "../components/signin/SubmitButton.tsx";
import api from "../services/api.ts";

type DailyJournalFormInputs = {
    mood: number;
    journal_entry?: string;
};

function DailyJournalPage(): JSX.Element {
    const { register, handleSubmit } = useForm<DailyJournalFormInputs>();

    const onSubmit = async (data: DailyJournalFormInputs) => {
        const mood = data.mood;
        const journal_entry = data.journal_entry ?? "";
        try {
            const res = await api.post("/api/user/daily-journals/list/", {
                mood,
                journal_entry,
            });
            //const res = await api.get("/api/user/daily-journals/list/");
            //const res = await api.delete("api/user/daily-journals/delete/1/");
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    async function getDailyJournals() {
        try {
            const res = await api.get("/api/user/daily-journals/list/");
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="p-[25px] flex flex-col justify-center items-center bg-color-1 min-h-screen">
                <DateCalendar className="bg-color-2 rounded" />

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
                            <MoodSlider register={register("mood")} />
                        </div>
                        <textarea
                            className="w-full min-h-[100px] text-font p-[10px] bg-[var(--soft-white)]"
                            placeholder="How was your day?"
                            {...register("journal_entry")}
                        ></textarea>
                        <div className="w-full flex justify-center">
                            <SubmitButton content="Submit"></SubmitButton>
                        </div>
                        <button type="button" onClick={getDailyJournals}>
                            Get
                        </button>
                    </form>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default DailyJournalPage;
