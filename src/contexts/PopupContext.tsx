import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react"; // You can use other icon libs too
import { PopupController } from "../utils/PopupController";

const PopupContext = createContext(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [popupData, setPopupData] = useState<{
		title: string;
		description: string;
		contactEmail: string;
		icon?: "success" | "error" | "warning" | "info" | React.ReactNode;
		onButtonClick?: () => void;
	}>({
		title: "",
		description: "",
		contactEmail: "",
	});

	useEffect(() => {
		PopupController.registerListener((options) => {
			setPopupData(options);
			setIsVisible(true);
		});
	}, []);

	const hidePopup = () => {
		setIsVisible(false);
	};

	const renderIcon = () => {
		if (typeof popupData.icon === "string") {
			switch (popupData.icon) {
				case "success":
					return (
						<CheckCircle className="h-12 w-12 text-green-500 mb-4 mx-auto" />
					);
				case "error":
					return <XCircle className="h-12 w-12 text-red-500 mb-4 mx-auto" />;
				case "warning":
					return (
						<AlertTriangle className="h-12 w-12 text-yellow-500 mb-4 mx-auto" />
					);
				case "info":
					return <Info className="h-12 w-12 text-blue-500 mb-4 mx-auto" />;
				default:
					return null;
			}
		} else if (React.isValidElement(popupData.icon)) {
			return popupData.icon;
		} else {
			return null;
		}
	};

	return (
		<PopupContext.Provider value={undefined}>
			{children}
			{isVisible && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="relative bg-[#1b012f] rounded-xl shadow-lg p-6 w-[60%] text-center">
						{/* Close Icon */}
						<button
							className="absolute top-3 right-3 text-gray-400 hover:text-white"
							onClick={hidePopup}
						>
							<X className="h-5 w-5" />
						</button>
						{renderIcon()}
						<h2 className="text-xl text-[#ffc300] font-semibold mb-2">
							{popupData.title}
						</h2>
						<p className="text-gray-400 mb-6">
							{popupData.description}{" "}
							<a
								href={`mailto:${popupData.contactEmail}`}
								className="text-blue-400 hover:text-blue-600"
							>
								{popupData.contactEmail}
							</a>
						</p>
						<div className="flex flex-row gap-8 justify-center">
							{/* <button
								onClick={() => {
									popupData.onButtonClick?.();
									hidePopup();
								}}
								className="bg-[#fcc300] text-black px-4 py-2 rounded hover:bg-[#fbb300] transition"
							>
								{popupData.buttonText}
							</button> */}
						</div>
					</div>
				</div>
			)}
		</PopupContext.Provider>
	);
};
