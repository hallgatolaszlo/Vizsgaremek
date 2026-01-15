"use client";

import { ToggleGroupItemText } from "@repo/ui";
import { CSSProperties, useState } from "react";
import { Card, ToggleGroup } from "tamagui";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthCardProps {
	onSignIn?: () => void;
	style?: CSSProperties;
}

export function AuthCard({ style, onSignIn = () => {} }: AuthCardProps) {
	const [selectedForm, setSelectedForm] = useState<string>("sign-in");

	function handleSelectedForm(form: string | null) {
		if (form !== null) {
			setSelectedForm(form);
		}
	}

	function handleSignInSuccess() {
		onSignIn();
	}

	return (
		<Card
			width="$size.20"
			style={{ alignItems: "center", ...style }}
			backgroundColor="$color1"
		>
			<ToggleGroup
				disableDeactivation
				value={selectedForm}
				type="single"
				onValueChange={(value) => handleSelectedForm(value)}
				borderColor="$color7"
			>
				<ToggleGroup.Item
					backgroundColor={
						selectedForm === "sign-in" ? "$color4" : "$color2"
					}
					focusStyle={{ backgroundColor: "$color4" }}
					hoverStyle={{
						cursor:
							selectedForm === "sign-in" ? "default" : "pointer",
						backgroundColor:
							selectedForm === "sign-in" ? "$color4" : "$color3",
						borderColor:
							selectedForm === "sign-in" ? "$color5" : "$color7",
					}}
					value="sign-in"
				>
					<ToggleGroupItemText text="Sign-In" />
				</ToggleGroup.Item>
				<ToggleGroup.Item
					backgroundColor={
						selectedForm === "sign-up" ? "$color4" : "$color2"
					}
					focusStyle={{ backgroundColor: "$color4" }}
					hoverStyle={{
						cursor:
							selectedForm === "sign-up" ? "default" : "pointer",
						backgroundColor:
							selectedForm === "sign-up" ? "$color4" : "$color3",
						borderColor:
							selectedForm === "sign-up" ? "$color5" : "$color7",
					}}
					value="sign-up"
				>
					<ToggleGroupItemText text="Sign-Up" />
				</ToggleGroup.Item>
			</ToggleGroup>
			<Card
				width="100%"
				padding="$4"
				borderColor="$color7"
				borderWidth={1}
				elevate
			>
				{selectedForm === "sign-in" ? (
					<SignInForm onSuccessfulSignIn={handleSignInSuccess} />
				) : (
					<SignUpForm />
				)}
			</Card>
		</Card>
	);
}
