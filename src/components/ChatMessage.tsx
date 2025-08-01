/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Message } from "../types";
import { User, Bot, Copy, RefreshCcw } from "lucide-react";
import ApprovalPopup from "./ApprovalPopup";
import { useAuth } from "../contexts/AuthContext";
// import MorphoPopup from "./morphoPopup";

interface ChatMessageProps {
	id: string;
	message: Message;
	page: string;
	toolMessage?: any;
	handleSendRetryAgentMessage?: any;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	id,
	message,
	page,
	toolMessage,
	handleSendRetryAgentMessage,
}) => {
	const { messageRetry } = useAuth();
	const isUser = message.sender === "user";
	const [showPopup, setShowPopup] = useState(true);

	const [popupOpened, setPopupOpened] = useState(false);
	const copyToClipboard = () => {
		navigator.clipboard.writeText(message.content);
	};
	// const [showPopup, setShowPopup] = React.useState(false);
	const isSwapPrompt = (prompt?: string) => {
		if (prompt === null || prompt === undefined) {
			return false;
		}
		const lowercasePrompt = prompt.toLowerCase();

		if (
			lowercasePrompt.includes("get quote") ||
			lowercasePrompt.includes("swap quote") ||
			lowercasePrompt.includes("swap") ||
			lowercasePrompt.includes("swap") ||
			lowercasePrompt.includes("fetch quote") ||
			lowercasePrompt.includes("convert") ||
			lowercasePrompt.includes("swapping") ||
			lowercasePrompt.includes("exchange")
		) {
			return true;
		} else {
			return false;
		}
	};
	const isSwapPossible = (prompt?: string) => {
		if (prompt === null || prompt === undefined) {
			return false;
		}
		const lowercasePrompt = prompt.toLowerCase();
		if (
			lowercasePrompt.includes("don't have sufficient funds") ||
			lowercasePrompt.includes("native balance of 0") ||
			lowercasePrompt.includes("insufficient") ||
			lowercasePrompt.includes("does not have") ||
			lowercasePrompt.includes("no native Ether") ||
			lowercasePrompt.includes("not enough") ||
			lowercasePrompt.includes("unsuccessful") ||
			lowercasePrompt.includes("failure") ||
			lowercasePrompt.includes("don't have the capability") ||
			lowercasePrompt.includes("not found") ||
			lowercasePrompt.includes("issue") ||
			lowercasePrompt.includes("issue fetching") ||
			lowercasePrompt.includes("try again")
		) {
			return false;
		} else {
			return true;
		}
	};
	const formatTime = (timestamp: Date) => {
		return new Date(timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	const isValidEvmAddress = (address: string) => {
		return /^0x[a-fA-F0-9]{40}$/.test(address);
	};

	return (
		<>
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
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<span className="font-normal text-[#E1D9F0]">
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
							{(toolMessage !== undefined || toolMessage !== null) &&
							toolMessage !== undefined &&
							toolMessage !== null &&
							Object.keys(toolMessage).length > 0 &&
							isValidEvmAddress(toolMessage.tokenIn) &&
							isValidEvmAddress(toolMessage.tokenOut) &&
							(message.txnHash === null || message.txnHash === undefined) &&
							message.sender === "agent" &&
							page === "agentChat" &&
							showPopup ? (
								<div>
									<p className="whitespace-pre-wrap w-full">
										{/* <button
													className="text-blue-500 underline"
													onClick={() => setShowPopup(true)}
												>
													Show Approval Popup
												</button> */}
										{/* {showPopup && ( */}
										{
											// message.type ===
											// "MorphoWriteActionProvider_supply_loan_asset" ? (
											// 	<MorphoPopup
											// 		onClose={() => setShowPopup(false)}
											// 		messageId={Number(message.id)}
											// 	/>
											// )
											// :

											<ApprovalPopup
												onClose={() => setShowPopup(false)}
												messageId={Number(message.id)}
												setPopupOpened={setPopupOpened}
												toolMessage={toolMessage}
											/>
										}
										{/* )} */}
									</p>
								</div>
							) : message.txnHash === null || message.txnHash === undefined ? (
								message.content.split("\n").map((line, index) => (
									<p key={index} className={index > 0 ? "mt-2" : ""}>
										{line}
									</p>
								))
							) : (
								<>
									<p>
										Your transaction has been confirmed on the blockchain.
										<a
											href={`${import.meta.env.VITE_KATANA_EXPLORER_URL}${
												message.txnHash
											}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 underline text-sm"
										>
											View on Explorer
										</a>
									</p>
								</>
							)}

							{/* {(toolMessage === undefined || toolMessage === null) &&
							toolMessage === undefined &&
							toolMessage === null &&
							Object.keys(toolMessage).length === 0 &&
							(message.txnHash === null || message.txnHash === undefined)
								? message.content.split("\n").map((line, index) => (
										<p key={index} className={index > 0 ? "mt-2" : ""}>
											{line}
										</p>
								  ))
								: null} */}
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
					<div>
						{messageRetry === id ? (
							<div className="flex flex-row gap-2">
								<p className="text-gray-300">
									Something went wrong. Please retry.
								</p>
								<RefreshCcw
									size={18}
									className="h-5 text-white hover:text-blue-500 hover:cursor-pointer"
									onClick={() => handleSendRetryAgentMessage(id)}
								/>
							</div>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</>
	);
};

// export default ChatMessage;
const areEqual = (prevProps: ChatMessageProps, nextProps: ChatMessageProps) => {
	return (
		prevProps.id === nextProps.id &&
		prevProps.message.content === nextProps.message.content &&
		prevProps.message.txnHash === nextProps.message.txnHash &&
		JSON.stringify(prevProps.toolMessage) ===
			JSON.stringify(nextProps.toolMessage) &&
		prevProps.handleSendRetryAgentMessage ===
			nextProps.handleSendRetryAgentMessage
	);
};

export default React.memo(ChatMessage, areEqual);
