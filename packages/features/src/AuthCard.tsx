"use client";

import { useState, type JSX } from "react";
import { Text, ToggleGroup, YStack } from "tamagui";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export function AuthCard(): JSX.Element {
	const [selectedForm, setSelectedForm] = useState<string>("sign-in");

	function handleSelectedForm(form: string | null) {
		if (form !== null) {
			setSelectedForm(form);
		}
	}

	// Component for ToggleGroup Item Text to avoid console errors
	const ToggleGroupItemText = ({ text }: { text: string }) => {
		return <Text>{text}</Text>;
	};

	return (
		<YStack style={{ alignItems: "center" }}>
			<ToggleGroup
				disableDeactivation
				value={selectedForm}
				type="single"
				onValueChange={(value) => handleSelectedForm(value)}
			>
				<ToggleGroup.Item value="sign-in">
					<ToggleGroupItemText text="Sign-In" />
				</ToggleGroup.Item>
				<ToggleGroup.Item value="sign-up">
					<ToggleGroupItemText text="Sign-Up" />
				</ToggleGroup.Item>
			</ToggleGroup>
			{selectedForm === "sign-in" ? <SignInForm /> : <SignUpForm />}
		</YStack>
	);
}
