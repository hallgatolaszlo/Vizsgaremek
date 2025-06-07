import type {JSX} from "react";

function LoginPage(): JSX.Element {
    return (
        <div className="flex justify-center bg-color-1 min-h-screen">
            <div className="flex bg-color-2 w-full h-fit" style={{maxWidth: "500px"}}>
                <h1 className="text-color-1">Hello</h1>
            </div>
        </div>
    );
}

export default LoginPage;