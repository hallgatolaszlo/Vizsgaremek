import { type JSX } from "react";

const moodEmojis = ["😢", "😞", "😕", "😐", "🙂", "😊", "😀", "😄", "😁", "🤩"];

interface Props {
    value: number;
    onChange: (val: number) => void;
}

function MoodSlider({ value, onChange }: Props): JSX.Element {
    return (
        <div className="flex flex-col items-center space-y-4">
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-[var(--btn-color-1)]"
            />
            <div className="text-4xl">{moodEmojis[value - 1]}</div>
        </div>
    );
}

export default MoodSlider;
