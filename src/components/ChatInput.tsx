import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ChatInputProps {
	onSendMessage: (message: string, agentType: string) => void;
	disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
	onSendMessage,
	disabled = false,
}) => {
	const [message, setMessage] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { agentType, allChats } = useAuth();
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [message]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim() && !disabled) {
			onSendMessage(message.trim(), agentType);
			setMessage("");
			if (textareaRef.current) {
				textareaRef.current.focus();
			}
		}
	};
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [allChats]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<div className=" border-gray-200 bg-[#1B012F] p-1">
			<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
				<div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
					<div className="flex items-start space-x-3 p-2">
						{/* <button
							type="button"
							className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
							title="Attach file"
						>
							<Paperclip className="h-5 w-5" />
						</button> */}

						<textarea
							ref={textareaRef}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Type your message here..."
							disabled={disabled}
							rows={1}
							className="flex-1 resize-none bg-transparent border-none text-gray-900 placeholder-gray-500 text-sm leading-8 max-h-24 focus:outline-none focus:ring-0"
						/>

						<div className="flex items-center space-x-2">
							{/* <button
								type="button"
								className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
								title="Voice message"
							>
								<Mic className="h-5 w-5" />
							</button> */}

							<button
								type="submit"
								disabled={!message.trim() || disabled}
								className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								title="Send message"
							>
								<Send className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between mt-2 px-4 text-xs text-gray-500">
					<span>Press Enter to send, Shift + Enter for new line</span>
					<span>{message.length}/2000</span>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
