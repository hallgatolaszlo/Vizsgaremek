import { type JSX } from "react";

function Home(): JSX.Element {
    return (
        <div className="p-[25px] flex justify-center items-center bg-color-1 min-h-screen">
            <div
                style={{ border: "3px solid var(--btn-color-1)" }}
                className="p-[25px] gap-7 flex flex-col items-center rounded-[20px] bg-color-2 w-full h-fit max-w-[500px] login-card"
            >
                <h1 className="font-semibold text-center leading-[100%] title-font text-color-1 text-[46px]">
                    Welcome to the Home Page
                </h1>
            </div>
        </div>
    );
}

export default Home;
