import { type JSX } from "react";
import { useForm } from "react-hook-form";
import MoodSlider from "../components/daily-journal/MoodSlider.tsx";
import Hr from "../components/signin/Hr.tsx";
import SubmitButton from "../components/signin/SubmitButton.tsx";

type DailyJournalFormInputs = {
    mood: number;
    journal_entry: string;
};

function DailyJournalPage(): JSX.Element {
    const { register, handleSubmit } = useForm<DailyJournalFormInputs>();

    const onSubmit = async (data: DailyJournalFormInputs) => {
        console.log(data);
    };

    return (
        <div className="p-[25px] flex justify-center items-center bg-color-1 min-h-screen">
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
                        style={{
                            backgroundColor: "var(--soft-white)",
                        }}
                        className="w-full min-h-[100px] text-font p-[10px]"
                        placeholder="How was your day?"
                    ></textarea>
                    <div className="w-full flex justify-center">
                        <SubmitButton content="Submit"></SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DailyJournalPage;
