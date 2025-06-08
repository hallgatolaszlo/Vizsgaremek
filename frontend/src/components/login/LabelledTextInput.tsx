import {type JSX} from "react";
import {type UseFormRegisterReturn} from "react-hook-form";

interface Props {
    label: string;
    placeholder?: string;
    register: UseFormRegisterReturn;
}

function LabelledTextInput({label, placeholder, register}: Props): JSX.Element {
    return (
        <div className="flex gap-[2px] flex-col items-start h-fit w-full bg-color-2">
            <p className="font-semibold text-color-1 text-font text-[20px]">{label}</p>
            <input {...register}
                   className="w-full h-[40px] px-[10px] py-[5px] text-[16px] rounded text-font"
                   style={{backgroundColor: "var(--soft-white)"}}
                   placeholder={placeholder}
                   type="text"></input>
        </div>
    );
}

export default LabelledTextInput;