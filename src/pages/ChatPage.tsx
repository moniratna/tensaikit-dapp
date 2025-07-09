import React, { useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { Bot } from "lucide-react";
import iconLogo from "../assets/iconYellow.png";
import { useAuth } from "../contexts/AuthContext";
import useChatMessages from "../hooks/useGetMessages";
import { useInView } from "react-intersection-observer";

interface ChatPageProps {
	activeChatId: string | null;
	isTyping: boolean;
	handleSendMessage: (content: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
	activeChatId,
	isTyping,
	handleSendMessage,
}) => {
	// const [isTyping, setIsTyping] = useState(false);
	// const [allChats, setAllChats] = useState<Message[]>([]);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { allChats, setAllChats } = useAuth();
	// const [tempThreadId, setTempThreadId] = useState<number | null>(null);
	const {
		data: messages,
		isLoading: isLoadingMessages,
		isFetchingNextPage,
		fetchNextPage,
		isFetching,
		hasNextPage,
	} = useChatMessages(
		Number(activeChatId),
		localStorage.getItem("authToken") || "",
		activeChatId !== "new" &&
			activeChatId !== undefined &&
			activeChatId !== "agentType"
			? true
			: false
	);
	const threadMessages = messages?.pages.flatMap((page) => page.messages);
	useEffect(() => {
		if (!isLoadingMessages && threadMessages) {
			setAllChats(threadMessages);
		}
		if (activeChatId === "new") {
			setAllChats([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingMessages, activeChatId, messages]);
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [allChats]);
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView && !isFetching && hasNextPage) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, isFetching, hasNextPage]);

	if (!activeChatId || activeChatId === "agentType") {
		return (
			<div className="flex-1 flex items-center justify-center bg-[#1B012F]">
				<div className="text-center space-y-6 max-w-md">
					<div className="w-24 h-24 bg-gradient-to-r rounded-3xl flex items-center justify-center mx-auto shadow-lg">
						{/* <Bot className="h-12 w-12 text-white" /> */}
						<img src={iconLogo} alt="AgentKit Logo" className="h-24 w-24" />
					</div>
					<div className="space-y-3">
						<h2 className="text-2xl font-bold text-[#ffc300]">
							Welcome to Agent Kit
						</h2>
						<p className="text-gray-600 leading-relaxed">
							Your AI-powered assistant for DeFi protocols and blockchain
							interactions. Start a new conversation to begin exploring the
							decentralized finance ecosystem.
						</p>
					</div>
					<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
						{/* <Sparkles className="h-4 w-4" /> */}
						{/* <span>Powered by advanced AI technology</span> */}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-[#1B012F] overflow-auto">
			{/* Chat Header */}

			{/* Messages */}
			<div className="flex-1 overflow-y-auto">
				<div className="flex flex-col gap-4 p-6">
					{!isLoadingMessages &&
						allChats.map((message) => (
							<ChatMessage key={message.id} message={message} />
						))}
				</div>

				{isTyping && (
					<div className="flex gap-4 p-6 bg-[#1B012F]">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
							<Bot className="h-4 w-4 text-white" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<span className="font-semibold text-gray-300">Assistant</span>
								<span className="text-xs text-gray-500">typing...</span>
							</div>
							<div className="flex space-x-1">
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
								<div
									className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
									style={{ animationDelay: "0.1s" }}
								></div>
								<div
									className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
									style={{ animationDelay: "0.2s" }}
								></div>
							</div>
						</div>
					</div>
				)}
				<div ref={ref} className="w-full text-center text-white">
					{isFetchingNextPage && hasNextPage ? "Loading..." : <></>}
				</div>
				<div ref={messagesEndRef} />
			</div>

			{/* Chat Input */}
			<ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
		</div>
	);
};

export default ChatPage;
