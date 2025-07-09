import React, { useState } from "react";
import { Message } from "../types";
import { User, Bot, Copy } from "lucide-react";
import ApprovalPopup from "./ApprovalPopup";

interface ChatMessageProps {
	message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
	const isUser = message.sender === "user";
	const [showPopup, setShowPopup] = useState(true);
	const copyToClipboard = () => {
		navigator.clipboard.writeText(message.content);
	};

	const formatTime = (timestamp: Date) => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div
			className={`group rounded-lg flex p-6 gap-4 ${
				isUser ? "flex-row-reverse" : "flex-row bg-[#1B012F]"
			}`}
		>
			{/* Avatar */}
			<div
				className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
					isUser
						? "bg-gradient-to-r bg-[#ffc300]"
						: "bg-gradient-to-r bg-[#ffc300]"
				}`}
			>
				{isUser ? (
					<User className="h-4 w-4 text-white" />
				) : (
					<Bot className="h-4 w-4 text-white" />
				)}
			</div>

			{/* Message content */}
			<div
				className={`flex-1 space-y-2 ${
					isUser ? "text-right items-end" : "text-left items-start"
				} flex flex-col`}
			>
				{/* Name & Timestamp */}
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<span className="font-semibold text-[#E1D9F0]">
						{isUser ? "You" : "Assistant"}
					</span>
					<span className="text-xs text-white">
						{formatTime(message.createdAt)}
					</span>
				</div>

				{/* Message Text */}
				{/* <div
					className={
						isUser
							? "prose prose-sm w-1/2 text-white self-end max-w-[60%]"
							: "prose prose-sm max-w-none text-white leading-relaxed"
					}
				> */}
				<div
					className={`prose prose-sm text-white leading-relaxed rounded-lg ${
						isUser
							? "bg-[#3C3C66] px-4 py-2 self-end max-w-[60%]"
							: "bg-[#292046] px-4 py-2 self-start max-w-[70%]"
					}`}
				>
					<div className="prose dark:prose-invert max-w-none">
						{message.type === "SushiSwapQuoteActions_get_swap_quote" &&
						(message.txnHash === null || message.txnHash === undefined) &&
						showPopup ? (
							<>
								<p className="whitespace-pre-wrap m-0">
									{/* <button
													className="text-blue-500 underline"
													onClick={() => setShowPopup(true)}
												>
													Show Approval Popup
												</button> */}
									{/* {showPopup && ( */}
									<ApprovalPopup
										onClose={() => setShowPopup(false)}
										messageId={Number(message.id)}
									/>
									{/* )} */}
								</p>
							</>
						) : message.type === "SushiSwapQuoteActions_get_swap_quote" &&
						  message.txnHash !== null ? (
							<>
								<p>
									Your transaction has been confirmed on the blockchain.
									<a
										href={`https://explorer.tatara.katana.network/tx/${message.txnHash}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 underline text-sm"
									>
										View on Explorer
									</a>
								</p>
							</>
						) : null}
						{message.type !== "SushiSwapQuoteActions_get_swap_quote"
							? message.content.split("\n").map((line, index) => (
									<p key={index} className={index > 0 ? "mt-2" : ""}>
										{line}
									</p>
							  ))
							: null}
					</div>
				</div>

				{/* Agent Action Buttons */}
				{!isUser && (
					<div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							onClick={copyToClipboard}
							className="p-1 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-0"
							title="Copy message"
						>
							<Copy className="h-4 w-4 text-gray-500" />
						</button>
						{/* <button
							className="p-1 hover:bg-gray-200 rounded transition-colors"
							title="Good response"
						>
							<ThumbsUp className="h-4 w-4 text-gray-500" />
						</button>
						<button
							className="p-1 hover:bg-gray-200 rounded transition-colors"
							title="Bad response"
						>
							<ThumbsDown className="h-4 w-4 text-gray-500" />
						</button> */}
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
