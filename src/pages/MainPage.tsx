/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ChatThread } from "../types";
import Sidebar from "../components/Sidebar";
import ChatPage from "./ChatPage";
import ProtocolsPage from "./ProtocolsPage";
import { useAuth } from "../contexts/AuthContext";
import useChatAgent from "../hooks/useChatAgent";
import useThreads from "../hooks/useThreads";
import AgentChatPage from "./AgentChatPage";

const MainPage: React.FC = () => {
	const {
		activeChatId,
		setActiveChatId,
		isOpenSidebar,
		agentType,
		setAgentType,
		allChats,
		setAllChats,
		selectedAgent,
	} = useAuth();

	const [activeTab, setActiveTab] = useState<"chat" | "protocols">("chat");
	const [autoSearch, setAutoSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [tempThreadId, setTempThreadId] = useState<number | null>(null);
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

	const handleNewChat = () => {
		const newChat: ChatThread = {
			id: "new",
			title: "New Chat",
			messages: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		setActiveChatId(newChat.id);
		setActiveTab("chat");
		setTempThreadId(null);
		setHasFetchedOnce(false);
		setAgentType("default");
	};

	const handleChatSelect = (chatId: string) => {
		setActiveChatId(chatId);
		setActiveTab("chat");
	};

	const handleTabChange = (tab: "chat" | "protocols") => {
		setActiveTab(tab);
		if (tab === "protocols") {
			setActiveChatId(null);
		}
	};

	useEffect(() => {
		if (autoSearch && searchQuery !== "") {
			handleSendAgentMessage(searchQuery.trim(), agentType);
			setAutoSearch(false);
			setSearchQuery("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoSearch, searchQuery]);

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
		const currentMessages = allChats || [];
		const updatedMessages = [...currentMessages, userMessage];
		setAllChats([...allChats, userMessage]);
		console.log("checking updated messages", updatedMessages);
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
						id: data.data.messageId,
						content: data.data.data,
						sender: "agent",
						createdAt: new Date(),
						type: data.data.type,
					};

					const finalMessages = [...updatedMessages, assistantMessage];
					console.log("checking final messages", finalMessages);
					setAllChats([...finalMessages]);
					setIsTyping(false);
					setActiveChatId(data.data.threadId);
					setTempThreadId(data.data.threadId);
					if (!hasFetchedOnce) {
						refetchThreads();
					}
					setHasFetchedOnce(true);
				},
			}
		);
	};
	const handleSendAgentMessage = async (
		content: string,
		agentType?: string
	) => {
		const userMessage: any = {
			id: Date.now().toString(),
			content,
			sender: "user",
			createdAt: new Date(),
		};

		// Add user message to chat
		const currentMessages = allChats || [];
		const updatedMessages = [...currentMessages, userMessage];
		setAllChats(updatedMessages);
		console.log("checking updated messages", updatedMessages);
		// Simulate AI response
		setIsTyping(true);

		// TODO: Replace with actual API call to your backend
		chatAgent(
			{
				token: localStorage.getItem("authToken") || "",
				prompt: content,
				threadId:
					(activeChatId === "new" || activeChatId === "agentType") &&
					tempThreadId === null
						? undefined
						: tempThreadId || Number(activeChatId),
				agentType: agentType,
			},
			{
				onSuccess: (data: any) => {
					console.log("checking new chat data", data);
					const assistantMessage: any = {
						id: data.data.messageId,
						content: data.data.data,
						sender: "agent",
						createdAt: new Date(),
						type: data.data.type,
					};

					const finalMessages = [...updatedMessages, assistantMessage];
					console.log("checking final messages", finalMessages);
					setAllChats([...finalMessages]);
					setIsTyping(false);
					setActiveChatId(data.data.threadId);
					setTempThreadId(data.data.threadId);
					if (!hasFetchedOnce) {
						refetchThreads();
					}
					setHasFetchedOnce(true);
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
						isTyping={isTyping}
						handleSendMessage={handleSendMessage}
					/>
				) : (
					<>
						{selectedAgent !== "" ? (
							<AgentChatPage
								agentType={selectedAgent}
								isTyping={isTyping}
								handleSendMessage={handleSendAgentMessage}
							/>
						) : (
							<ProtocolsPage
								setAutoSearch={setAutoSearch}
								setSearchQuery={setSearchQuery}
								setAgentType={setAgentType}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default MainPage;
