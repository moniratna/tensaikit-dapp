/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ChatThread, Message } from "../types";
import Sidebar from "../components/Sidebar";
import ChatPage from "./ChatPage";
import ProtocolsPage from "./ProtocolsPage";
import { useAuth } from "../contexts/AuthContext";
import useChatAgent from "../hooks/useChatAgent";
import useThreads from "../hooks/useThreads";
import useChatMessages from "../hooks/useGetMessages";

const MainPage: React.FC = () => {
	const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
	const {
		activeChatId,
		setActiveChatId,
		isOpenSidebar,
		agentType,
		setAgentType,
	} = useAuth();
	// const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"chat" | "protocols">("chat");
	const [autoSearch, setAutoSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	// const [chatMessage, setChatMessage] = useState<Message[]>([]);

	// Load chat threads from localStorage on mount
	// useEffect(() => {
	// 	const savedChats = localStorage.getItem("chatThreads");
	// 	if (savedChats) {
	// 		const parsedChats = JSON.parse(savedChats);
	// 		// Convert date strings back to Date objects
	// 		const chatsWithDates = parsedChats.map((chat: any) => ({
	// 			...chat,
	// 			createdAt: new Date(chat.createdAt),
	// 			updatedAt: new Date(chat.updatedAt),
	// 			messages: chat.messages.map((msg: any) => ({
	// 				...msg,
	// 				timestamp: new Date(msg.timestamp),
	// 			})),
	// 		}));
	// 		setChatThreads(chatsWithDates);
	// 	}
	// }, []);

	// Save chat threads to localStorage whenever they change
	// useEffect(() => {
	// 	if (chatThreads.length > 0) {
	// 		localStorage.setItem("chatThreads", JSON.stringify(chatThreads));
	// 	}
	// }, [chatThreads]);

	const handleNewChat = () => {
		const newChat: ChatThread = {
			id: "new",
			title: "New Chat",
			messages: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		setChatThreads((prev) => [newChat, ...prev]);
		setActiveChatId(newChat.id);
		setActiveTab("chat");
		setTempThreadId(null);
	};

	const handleChatSelect = (chatId: string) => {
		setActiveChatId(chatId);
		setActiveTab("chat");
	};
	const handleUpdateChat = (chatId: string, messages: Message[]) => {
		setChatThreads((prev) =>
			prev.map((chat) => {
				if (chat.id === chatId) {
					// Generate title from first user message if it's still "New Chat"
					let title = chat.title;
					if (title === "New Chat" && messages.length > 0) {
						const firstUserMessage = messages.find(
							(msg) => msg.sender === "user"
						);
						if (firstUserMessage) {
							title =
								firstUserMessage.content.slice(0, 50) +
								(firstUserMessage.content.length > 50 ? "..." : "");
						}
					}

					return {
						...chat,
						title,
						messages,
						updatedAt: new Date(),
					};
				}
				return chat;
			})
		);
		// setChatMessage((prev) => [...prev, ...messages]);
	};

	const handleTabChange = (tab: "chat" | "protocols") => {
		setActiveTab(tab);
		if (tab === "protocols") {
			setActiveChatId(null);
		}
	};
	const { data: messages, isLoading: isLoadingMessages } = useChatMessages(
		Number(activeChatId),
		localStorage.getItem("authToken") || "",
		activeChatId !== "new" && activeChatId !== undefined ? true : false
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
	}, [isLoadingMessages, activeChatId]);
	useEffect(() => {
		if (autoSearch && searchQuery !== "") {
			handleSendMessage(searchQuery.trim(), agentType);
			setAutoSearch(false);
			setSearchQuery("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoSearch, searchQuery]);
	const [isTyping, setIsTyping] = useState(false);
	const [allChats, setAllChats] = useState<Message[]>([]);
	const [tempThreadId, setTempThreadId] = useState<number | null>(null);
	const { mutate: chatAgent } = useChatAgent();
	const { refetch: refetchThreads } = useThreads(
		localStorage.getItem("authToken") || "",
		true
	);
	console.log("temp threadId", tempThreadId, activeChatId);
	const handleSendMessage = async (content: string, agentType?: string) => {
		console.log(activeChatId, "activeChatId");
		if (!activeChatId) return;

		const userMessage: any = {
			id: Date.now().toString(),
			content,
			sender: "user",
			createdAt: new Date(),
		};

		// Add user message to chat
		const currentMessages = threadMessages || [];
		const updatedMessages = [...currentMessages, userMessage];
		handleUpdateChat(activeChatId, updatedMessages);
		setAllChats((prev) => [...prev, userMessage]);
		// Simulate AI response
		setIsTyping(true);

		// TODO: Replace with actual API call to your backend
		chatAgent(
			{
				token: localStorage.getItem("authToken") || "",
				prompt: content,
				threadId:
					activeChatId === "new" && tempThreadId === null
						? undefined
						: tempThreadId || Number(activeChatId),
				agentType: agentType,
			},
			{
				onSuccess: (data: any) => {
					console.log("checking new chat data", data);
					const assistantMessage: any = {
						id: (Date.now() + 1).toString(),
						content: data.data.data,
						sender: "agent",
						createdAt: new Date(),
						type: data.data.type,
					};

					const finalMessages = [...updatedMessages, assistantMessage];
					handleUpdateChat(activeChatId, finalMessages);
					setAllChats((prev) => [...prev, assistantMessage]);
					setIsTyping(false);
					setTempThreadId(data.data.threadId);
					refetchThreads();
				},
			}
		);
	};

	return (
		<div className="flex h-full bg-gray-100">
			{isOpenSidebar ? (
				<Sidebar
					activeChatId={activeChatId}
					onChatSelect={handleChatSelect}
					onNewChat={handleNewChat}
					activeTab={activeTab}
					onTabChange={handleTabChange}
				/>
			) : null}

			<div className="flex-1 flex flex-col">
				{activeTab === "chat" ? (
					<ChatPage
						activeChatId={activeChatId}
						chatThreads={chatThreads}
						onUpdateChat={handleUpdateChat}
						isLoadingMessages={isLoadingMessages}
						allChats={allChats}
						isTyping={isTyping}
						handleSendMessage={handleSendMessage}
					/>
				) : (
					<ProtocolsPage
						handleNewChat={handleNewChat}
						setAutoSearch={setAutoSearch}
						setSearchQuery={setSearchQuery}
						setAgentType={setAgentType}
					/>
				)}
			</div>
		</div>
	);
};

export default MainPage;
