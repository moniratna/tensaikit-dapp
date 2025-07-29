import { ReactNode } from "react";

type PopupOptions = {
	title: string;
	description: string;
	contactEmail: string;
	icon?: "success" | "error" | "warning" | "info" | ReactNode;
	onButtonClick?: () => void;
};

class PopupControllerClass {
	private listener: ((options: PopupOptions) => void) | null = null;

	registerListener = (cb: (options: PopupOptions) => void) => {
		this.listener = cb;
	};

	trigger = (options: PopupOptions) => {
		if (this.listener) {
			this.listener(options);
		} else {
			console.warn("PopupController: No listener registered!");
		}
	};
}

export const PopupController = new PopupControllerClass();
