import React, { useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { Bot } from "lucide-react";
import iconLogo from "../assets/iconYellow.png";
import { useAuth } from "../contexts/AuthContext";
import useChatMessages from "../hooks/useGetMessages";
import InfiniteScroll from "react-infinite-scroll-component";

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
		fetchNextPage,
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
	useEffect(() => {
		const threadMessages = messages?.pages.flatMap((page) => page.messages);
		if (!isLoadingMessages && threadMessages && messages) {
			if (allChats.length === 0) {
				setAllChats([...allChats, ...threadMessages]);
			} else {
				setAllChats([...threadMessages]);
			}
		}

		if (activeChatId === "new") {
			setAllChats([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingMessages, activeChatId, messages]);

	useEffect(() => {
		const container = messagesEndRef.current;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [isTyping]);

	if (!activeChatId || activeChatId === "agentType") {
		return (
			<>
				<div className="flex items-center justify-center bg-[#1B012F]">
					<div className="text-center space-y-6 max-w-md">
						<div className="w-24 h-24 bg-gradient-to-r rounded-3xl flex items-center justify-center mx-auto shadow-lg">
							{/* <Bot className="h-12 w-12 text-white" /> */}
							<img src={iconLogo} alt="AgentKit Logo" className="h-24 w-24" />
						</div>
						<div className="space-y-3">
							<h2 className="text-2xl font-bold text-[#ffc300]">
								Welcome to Tensai DeFi Agent
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Your AI-powered assistant for DeFi protocols and blockchain
								interactions on Katana. Start a new conversation to begin
								exploring the decentralized finance ecosystem.
							</p>
						</div>
						<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
							{/* <Sparkles className="h-4 w-4" /> */}
							{/* <span>Powered by advanced AI technology</span> */}
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center bg-[#1B012F]">
					<h2 className="text-2xl font-bold text-[#ffc300]">
						What can you do?
					</h2>
					<div className="flex mt-10 space-x-20">
						<div
							// key={protocol.id}
							className="w-[50%] bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
						>
							<div className="text-left space-y-6 max-w-md p-5">
								<div className="space-y-3">
									<h2 className="text-2xl text-center font-bold text-[#ffc300]">
										Chat Mode
									</h2>
									<ul className="list-disc text-gray-400 leading-relaxed ml-5">
										<li>Chat with AI using natural language</li>
										<li>Get your wallet related details</li>
										<li>Transfer tokens</li>
									</ul>
								</div>
								<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
									{/* <Sparkles className="h-4 w-4" /> */}
									{/* <span>Powered by advanced AI technology</span> */}
								</div>
							</div>
						</div>
						<div
							// key={protocol.id}
							className="w-[50%] bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
						>
							<div className="text-left space-y-6 p-5 max-w-md">
								<div className="space-y-3">
									<h2 className="text-2xl text-center font-bold text-[#ffc300]">
										Sushi Agent Mode
									</h2>
									<ul className="list-disc text-gray-400 leading-relaxed ml-5">
										<li>Chat with Sushi Agent using natural language</li>
										<li>Generates a quote for swapping two tokens.</li>
										<li>Executes a token swap on SushiSwap </li>
									</ul>
								</div>
								<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
									{/* <Sparkles className="h-4 w-4" /> */}
									{/* <span>Powered by advanced AI technology</span> */}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex-1 flex gap-36 items-center justify-center bg-[#1B012F]"></div>
			</>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-[#1B012F] overflow-hidden w-full">
			{/* Chat Header */}
			{!isLoadingMessages && allChats.length === 0 && (
				<div className="flex-1 flex items-center justify-center bg-[#1B012F]">
					<div className="text-center space-y-6 max-w-md">
						<div className="space-y-3">
							<h2 className="text-2xl font-bold text-[#ffc300]">
								Start a new conversation
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Your AI-powered assistant for DeFi protocols and blockchain
								interactions on Katana. Start a new conversation to begin
								exploring the decentralized finance ecosystem.
							</p>
						</div>
						<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
							{/* <Sparkles className="h-4 w-4" /> */}
							{/* <span>Powered by advanced AI technology</span> */}
						</div>
					</div>
				</div>
			)}

			<div
				id="scrollableDiv"
				style={{
					overflowY: "scroll",
					display: "flex",
					flexDirection: "column-reverse",
					margin: "auto",
					width: "100%",
					height: "100%",
				}}
				className="flex-1 overflow-y-auto w-fit"
				ref={messagesEndRef}
				// onScroll={handleScroll}
			>
				<div className="flex flex-col-reverse gap-4 p-6 w-full">
					<InfiniteScroll
						dataLength={allChats.length}
						next={fetchNextPage}
						hasMore={!!hasNextPage}
						style={{
							display: "flex",
							flexDirection: "column-reverse",
							overflow: "visible",
							width: "100%",
						}}
						loader={
							<p className="text-center text-white">
								Loading older messages...
							</p>
						}
						scrollableTarget="scrollableDiv"
						inverse={true} // <- Important: for bottom-up
					>
						{allChats.map((message, index) => (
							<ChatMessage key={index} message={message} page="chat" />
						))}
						{/* <div ref={messagesEndRef} /> */}
					</InfiniteScroll>
				</div>
			</div>
			<div className="flex-shrink-0 px-12 py-5">
				{isTyping && (
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#fcc300] to-[#fbb300] flex items-center justify-center">
							<Bot className="h-4 w-4 text-white" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<span className="font-semibold text-gray-300">Assistant</span>
								<span className="text-xs text-gray-500">
									tensai is working on your request...
								</span>
							</div>
							<div className="flex space-x-1">
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
							</div>
						</div>
					</div>
				)}
			</div>
			{/* Chat Input */}
			<ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
		</div>
	);
};

export default ChatPage;
