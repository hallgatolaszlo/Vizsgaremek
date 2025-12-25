"use client";

import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState, type JSX } from "react";
import SignInForm from "../_components/signInPage/SignInForm";
import SignUpForm from "../_components/signInPage/SignUpForm";

export default function SignInPage(): JSX.Element {
	const [selectedForm, setSelectedForm] = useState<string>("sign-in");

	function handleSelectedForm(
		_event: React.MouseEvent<HTMLElement>,
		newForm: string | null
	) {
		if (newForm !== null) {
			setSelectedForm(newForm);
		}
	}

	return (
		<Stack
			direction="column"
			spacing={3}
			alignItems="center"
			justifyContent="center"
		>
			<ToggleButtonGroup
				color="primary"
				value={selectedForm}
				exclusive
				onChange={handleSelectedForm}
			>
				<ToggleButton value="sign-in">Sign In</ToggleButton>
				<ToggleButton value="sign-up">Sign Up</ToggleButton>
			</ToggleButtonGroup>
			{selectedForm === "sign-in" ? <SignInForm /> : <SignUpForm />}
		</Stack>
	);
}
