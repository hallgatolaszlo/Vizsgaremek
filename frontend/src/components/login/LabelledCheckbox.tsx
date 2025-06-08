import {type JSX} from "react";
import {type UseFormRegisterReturn} from "react-hook-form";

interface Props {
    label: string;
    register: UseFormRegisterReturn;
}

function LabelledCheckbox({label, register}: Props): JSX.Element {
    return (
        <div className="flex items-center gap-[5px] w-fit">
            <input {...register} style={{accentColor: "var(--btn-color-1)"}}
                   className="w-[15px] h-[15px]"
                   type="checkbox"/>
            <label className="font-semibold text-font text-color-1 text-[20px]">{label}</label>
        </div>
    );
}

export default LabelledCheckbox;