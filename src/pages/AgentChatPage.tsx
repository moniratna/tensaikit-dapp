// import React, { useEffect, useRef, useState } from "react";
// import ChatMessage from "../components/ChatMessage";
// import ChatInput from "../components/ChatInput";
// import { Bot } from "lucide-react";
// import iconLogo from "../assets/iconYellow.png";
// import { useAuth } from "../contexts/AuthContext";
// import useGEtAgentMessages from "../hooks/useGetAgentMessages";

// interface ChatPageProps {
// 	agentType: string;
// 	isTyping: boolean;
// 	handleSendMessage: (content: string) => void;
// }

// const AgentChatPage: React.FC<ChatPageProps> = ({
// 	agentType,
// 	isTyping,
// 	handleSendMessage,
// }) => {
// 	const messagesEndRef = useRef<HTMLDivElement | null>(null);
// 	const { allChats, setAllChats, setActiveChatId, setAgentType } = useAuth();
// 	// const [tempThreadId, setTempThreadId] = useState<number | null>(null);
// 	const {
// 		data: messages,
// 		isLoading: isLoadingMessages,
// 		// isFetchingNextPage,
// 		fetchNextPage,
// 		isFetching,
// 		hasNextPage,
// 	} = useGEtAgentMessages(
// 		agentType,
// 		localStorage.getItem("authToken") || "",
// 		agentType !== "" && agentType !== null ? true : false
// 	);
// 	const threadMessages = messages?.pages.flatMap((page) => page.messages);
// 	useEffect(() => {
// 		if (!isLoadingMessages && threadMessages) {
// 			setAllChats(threadMessages);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [isLoadingMessages, messages]);
// 	useEffect(() => {
// 		if (messagesEndRef.current) {
// 			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
// 		}
// 	}, [isTyping]);
// 	// const [isScrolled, setIsScrolled] = useState(false);
// 	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
// 	useEffect(() => {
// 		const container = scrollContainerRef.current;
// 		if (!container || !hasNextPage || isFetching) return;

// 		const handleScroll = () => {
// 			if (container.scrollTop < 100) {
// 				console.log("I am triggering top");
// 				fetchNextPage();
// 			}
// 		};

// 		container.addEventListener("scrollend", handleScroll);
// 		return () => container.removeEventListener("scrollend", handleScroll);
// 	}, [fetchNextPage, hasNextPage, isFetching]);

// 	useEffect(() => {
// 		if (allChats.length <= 10 && scrollContainerRef.current) {
// 			const container = scrollContainerRef.current;
// 			container.scrollTop = container.scrollHeight;
// 		}
// 	}, [allChats]);

// 	if (!agentType) {
// 		return (
// 			<div className="flex-1 flex items-center justify-center bg-[#1B012F]">
// 				<div className="text-center space-y-6 max-w-md">
// 					<div className="w-24 h-24 bg-gradient-to-r rounded-3xl flex items-center justify-center mx-auto shadow-lg">
// 						{/* <Bot className="h-12 w-12 text-white" /> */}
// 						<img src={iconLogo} alt="AgentKit Logo" className="h-24 w-24" />
// 					</div>
// 					<div className="space-y-3">
// 						<h2 className="text-2xl font-bold text-[#ffc300]">
// 							Welcome to Agent Kit
// 						</h2>
// 						<p className="text-gray-600 leading-relaxed">
// 							Your AI-powered assistant for DeFi protocols and blockchain
// 							interactions. Start a new conversation to begin exploring the
// 							decentralized finance ecosystem.
// 						</p>
// 					</div>
// 					<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// 						{/* <Sparkles className="h-4 w-4" /> */}
// 						{/* <span>Powered by advanced AI technology</span> */}
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="flex-1 flex flex-col bg-[#1B012F] overflow-auto">
// 			{!isLoadingMessages && allChats.length === 0 && (
// 				<div className="flex-1 flex items-center justify-center bg-[#1B012F]">
// 					<div className="text-center space-y-6 max-w-md">
// 						<div className="space-y-3">
// 							<h2 className="text-2xl font-bold text-[#ffc300]">
// 								Start a new conversation
// 							</h2>
// 							<p className="text-gray-600 leading-relaxed">
// 								Your AI-powered assistant for DeFi protocols and blockchain
// 								interactions. Start a new conversation to begin exploring the
// 								decentralized finance ecosystem.
// 							</p>
// 						</div>
// 						<div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// 							{/* <Sparkles className="h-4 w-4" /> */}
// 							{/* <span>Powered by advanced AI technology</span> */}
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 			{/* Chat Header */}
// 			{/* <div className="border-b border-gray-200 px-6 py-4 bg-[#1B012F]">
// 				<div className="flex items-center justify-between">
// 					<div>
// 						<h2 className="text-lg font-semibold text-white">
// 							{activeChat?.title || "New Chat"}
// 						</h2>
// 						<p className="text-sm text-gray-500">AI Assistant • Online</p>
// 					</div>
// 					<div className="flex items-center space-x-2">
// 						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// 						<span className="text-sm text-gray-500">Connected</span>
// 					</div>
// 				</div>
// 			</div> */}

// 			{/* Messages */}
// 			<div className="flex-1 overflow-y-auto">
// 				<div className="flex flex-col gap-4 p-6">
// 					{!isLoadingMessages &&
// 						allChats.map((message) => (
// 							<ChatMessage key={message.id} message={message} />
// 						))}
// 				</div>

// 				{isTyping && (
// 					<div className="flex gap-4 p-6 bg-[#1B012F]">
// 						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#fcc300] to-[#fbb300] flex items-center justify-center">
// 							<Bot className="h-4 w-4 text-white" />
// 						</div>
// 						<div className="flex-1">
// 							<div className="flex items-center gap-2 mb-2">
// 								<span className="font-semibold text-gray-300">Assistant</span>
// 								<span className="text-xs text-gray-500">typing...</span>
// 							</div>
// 							<div className="flex space-x-1">
// 								<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
// 								<div
// 									className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
// 									style={{ animationDelay: "0.1s" }}
// 								></div>
// 								<div
// 									className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
// 									style={{ animationDelay: "0.2s" }}
// 								></div>
// 							</div>
// 						</div>
// 					</div>
// 				)}
// 				{/* <div ref={ref} className="w-full text-center text-white">
// 					{isFetchingNextPage && hasNextPage ? "Loading..." : <></>}
// 				</div>*/}
// 				<div ref={messagesEndRef} />
// 			</div>

// 			{/* Chat Input */}
// 			<ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
// 		</div>
// 	);
// };

// export default AgentChatPage;

import React, { useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { Bot } from "lucide-react";
import iconLogo from "../assets/iconYellow.png";
import { useAuth } from "../contexts/AuthContext";
import useGEtAgentMessages from "../hooks/useGetAgentMessages";
import InfiniteScroll from "react-infinite-scroll-component";
import { Message } from "../types";

interface ChatPageProps {
	agentType: string;
	isTyping: boolean;
	handleSendMessage: (content: string) => void;
	userPrompt?: object;
}

const AgentChatPage: React.FC<ChatPageProps> = ({
	agentType,
	isTyping,
	handleSendMessage,
	userPrompt,
}) => {
	console.log("checking user prompt", userPrompt);
	const { allChats, setAllChats } = useAuth();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const {
		data: messages,
		isLoading: isLoadingMessages,
		fetchNextPage,
		hasNextPage,
	} = useGEtAgentMessages(
		agentType,
		localStorage.getItem("authToken") || "",
		agentType !== "" && agentType !== null ? true : false
	);

	const threadMessages = messages?.pages.flatMap((page) => page.messages);

	// Update messages
	useEffect(() => {
		if (!isLoadingMessages && threadMessages) {
			if (userPrompt !== null) {
				setAllChats([userPrompt, ...threadMessages]);
			} else {
				setAllChats(threadMessages);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoadingMessages, messages, userPrompt]);
	useEffect(() => {
		const container = messagesEndRef.current;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [isTyping]);
	console.log("checkin all chats inside protocol", allChats);
	if (!agentType) {
		return (
			<div className="flex-1 flex items-center justify-center bg-[#1B012F]">
				{/* Initial empty state */}
				<div className="text-center space-y-6 max-w-md">
					<div className="w-24 h-24 bg-gradient-to-r rounded-3xl flex items-center justify-center mx-auto shadow-lg">
						<img src={iconLogo} alt="AgentKit Logo" className="h-24 w-24" />
					</div>
					<div className="space-y-3">
						<h2 className="text-2xl font-bold text-[#ffc300]">
							Welcome to Agent Kit
						</h2>
						<p className="text-gray-600 leading-relaxed">
							Your AI-powered assistant for DeFi protocols and blockchain
							interactions.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-[#1B012F] overflow-hidden w-full">
			{/* Chat messages */}

			<div
				// ref={scrollContainerRef}
				id="scrollableDiv"
				style={{
					overflowY: "scroll",
					display: "flex",
					flexDirection: "column-reverse",
					margin: "auto",
					height: "100%",
					width: "100%",
				}}
				className="flex-1 overflow-y-auto"
				ref={messagesEndRef}
				// onScroll={handleScroll}
			>
				<div className="flex flex-col-reverse gap-4 p-6">
					<InfiniteScroll
						dataLength={allChats.length}
						next={fetchNextPage}
						hasMore={!!hasNextPage}
						style={{
							display: "flex",
							flexDirection: "column-reverse",
							overflow: "visible",
						}}
						loader={
							<p className="text-center text-white">
								Loading older messages...
							</p>
						}
						scrollableTarget="scrollableDiv"
						inverse={true} // <- Important: for bottom-up
					>
						{allChats.map((message) => (
							<ChatMessage key={message.id} message={message} />
						))}
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
								<span className="text-xs text-gray-500">typing...</span>
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
			{/* Chat input */}
			<ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
		</div>
	);
};

export default AgentChatPage;
