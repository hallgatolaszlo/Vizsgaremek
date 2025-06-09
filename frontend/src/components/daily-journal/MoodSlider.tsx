import { useState, type JSX } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

const moodEmojis = ["😢", "😞", "😕", "😐", "🙂", "😊", "😀", "😄", "😁", "🤩"];

interface Props {
    register: UseFormRegisterReturn;
}

function MoodSlider({ register }: Props): JSX.Element {
    const [mood, setMood] = useState(5);

    return (
        <div className="flex flex-col items-center space-y-4">
            <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => {
                    setMood(Number(e.target.value));
                    register.onChange(e);
                }}
                className="w-full"
                style={{ accentColor: "var(--btn-color-1)" }}
                name={register.name}
                onBlur={register.onBlur}
                ref={register.ref}
            />
            <div className="text-4xl">{moodEmojis[mood - 1]}</div>
        </div>
    );
}

export default MoodSlider;
