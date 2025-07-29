import React from "react";

interface CenteredPopupProps {
	title: string;
	description: string;
	buttonText: string;
	onButtonClick: () => void;
}

const CenteredPopup: React.FC<CenteredPopupProps> = ({
	title,
	description,
	buttonText,
	onButtonClick,
}) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
				<h2 className="text-xl font-semibold mb-4">{title}</h2>
				<p className="text-gray-600 mb-6">{description}</p>
				<button
					onClick={onButtonClick}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};

export default CenteredPopup;
