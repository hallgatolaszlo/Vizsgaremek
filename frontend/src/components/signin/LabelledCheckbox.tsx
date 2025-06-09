import { type JSX } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

interface Props {
    label: string;
    register: UseFormRegisterReturn;
}

function LabelledCheckbox({ label, register }: Props): JSX.Element {
    return (
        <div className="flex">
            <div className="h-[100%]">
                <input
                    {...register}
                    style={{ accentColor: "var(--btn-color-1)" }}
                    className="mt-[7px] min-w-[15px] min-h-[15px] mr-[10px]"
                    type="checkbox"
                />
            </div>
            <label className="font-semibold text-font text-color-1 text-[20px]">
                {label}
            </label>
        </div>
    );
}

export default LabelledCheckbox;
