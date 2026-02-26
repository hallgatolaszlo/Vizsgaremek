"use client";

import { ToggleGroupItemText } from "@repo/ui";
import { CSSProperties, useState } from "react";
import { Card, ToggleGroup } from "tamagui";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type FormType = "sign-in" | "sign-up";

interface AuthCardProps {
	onSignIn?: () => void;
	style?: CSSProperties;
}

function getToggleItemStyles(isActive: boolean) {
	return {
		backgroundColor: isActive ? "$color4" : "$color2",
		focusStyle: { backgroundColor: "$color4" },
		hoverStyle: {
			cursor: isActive ? "default" : "pointer",
			backgroundColor: isActive ? "$color4" : "$color3",
			borderColor: isActive ? "$color5" : "$color7",
		},
	} as const;
}

export function AuthCard({ style, onSignIn = () => {} }: AuthCardProps) {
	const [selectedForm, setSelectedForm] = useState<FormType>("sign-in");

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
				onValueChange={(value) =>
					value && setSelectedForm(value as FormType)
				}
				borderColor="$color7"
			>
				<ToggleGroup.Item
					{...getToggleItemStyles(selectedForm === "sign-in")}
					value="sign-in"
				>
					<ToggleGroupItemText text="Sign-In" />
				</ToggleGroup.Item>
				<ToggleGroup.Item
					{...getToggleItemStyles(selectedForm === "sign-up")}
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
					<SignInForm onSuccessfulSignIn={onSignIn} />
				) : (
					<SignUpForm />
				)}
			</Card>
		</Card>
	);
}
