import { useState, type JSX } from "react";
import { useTheme } from "../../contexts/ThemeContext/UseTheme";
import { MdOutlineImagesearchRoller } from "react-icons/md";
import "../../css/DropDownContent.css";
import useClickOutside from "./DropDownHandle";

function ThemeSwitcher(): JSX.Element {
    const { setCurrentTheme, currentThemeIndex } = useTheme();

    type ElementItem = {
        id: number;
        theme: string;
        color: string;
        label: string;
    };
    
    const elements: ElementItem[] = [
        { id: 1, theme: "darkBlue", color: "#2f3e50", label: "Dark Blue" },
        { id: 2, theme: "darkGreen", color: "#39504B", label: "Dark Green" },
        {
            id: 3,
            theme: "lightLavender",
            color: "#cac6df",
            label: "Light Lavender",
        },
        { id: 4, theme: "lightSand", color: "#D9D3C7", label: "Light Sand" },
    ];
    const [activeIndex, setActiveIndex] = useState<number>(currentThemeIndex);



    const [isOpen, setIsOpen] = useState(false);
    const themeDropdownRef = useClickOutside(async () => setIsOpen(false), isOpen);

    return (
        <div>
            <button
                className="text-[var(--text-color-1)] cursor-pointer"
                onClick={() => {setIsOpen(true)}}
            >
                <MdOutlineImagesearchRoller className="text-[1.8rem]" />
            </button>
            <div
                ref={themeDropdownRef}
                className={`absolute translate-x-[-85%] bg-white flex-col rounded-md mt-[5px] pt-0 pb-0 flex w-[12rem] z-[1000] ${isOpen && "dropdown-content"}`}
            >
                {isOpen && elements.map((item) => (
                    <p
                        key={item.id}
                        onClick={() => {
                            setCurrentTheme(item.theme);
                            setActiveIndex(item.id);
                            setIsOpen(!isOpen)
                        }}
                        className={`flex place-content-between cursor-pointer p-3 ${
                            activeIndex === item.id
                                ? "bg-[#aaaaaa]"
                                : "bg-white"
                        } ${item.id === 4 && "mb-1"}`}
                    >
                        {item.label}
                        <span
                            className={`w-5 h-5 rounded-full inline-block`}
                            style={{ backgroundColor: item.color }}
                        />
                    </p>
                ))}
            </div>
        </div>
    );
}

export default ThemeSwitcher;
