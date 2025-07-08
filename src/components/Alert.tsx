// components/Alert.tsx
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

interface AlertProps {
	type?: "success" | "error" | "warning" | "info";
	title?: string;
	message: string;
	onClose?: () => void;
}

const typeStyles = {
	success: {
		icon: <CheckCircle className="text-green-500" />,
		bg: "bg-green-50 border-green-500 text-green-800",
	},
	error: {
		icon: <AlertCircle className="text-red-500" />,
		bg: "bg-red-50 border-red-500 text-red-800",
	},
	warning: {
		icon: <AlertTriangle className="text-yellow-500" />,
		bg: "bg-yellow-50 border-yellow-500 text-yellow-800",
	},
	info: {
		icon: <Info className="text-blue-500" />,
		bg: "bg-blue-50 border-blue-500 text-blue-800",
	},
};

export default function Alert({
	type = "info",
	title,
	message,
	onClose,
}: AlertProps) {
	const styles = typeStyles[type];

	return (
		<div
			className={`relative w-full max-w-md mx-auto border-l-4 rounded-md p-4 flex items-start gap-3 shadow-md ${styles.bg}`}
		>
			<div className="pt-1">{styles.icon}</div>
			<div className="flex-1">
				{title && <h3 className="font-semibold mb-1">{title}</h3>}
				<p className="text-sm">{message}</p>
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-black"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
}
