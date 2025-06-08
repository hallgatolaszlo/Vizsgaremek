import {type JSX} from "react";

interface Props {
    content: string;
}

function SubmitButton({content}: Props): JSX.Element {
    return (
        <button
            className="font-semibold text-nowrap min-w-fit px-[20px] py-[10px] btn-color-1 rounded-[20px] text-font text-color-1 text-[32px]"
            type="submit">{content}</button>
    );
}

export default SubmitButton;