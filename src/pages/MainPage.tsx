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
import useFetchTokens from "../hooks/useFetchTokens";

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
		setAllTokens,
	} = useAuth();
	const { data: tokenData } = useFetchTokens(
		localStorage.getItem("authToken") || ""
	);
	const [activeTab, setActiveTab] = useState<"chat" | "protocols">("chat");
	const [autoSearch, setAutoSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
	const [userPrompt, setUserPrompt] = useState<any>(null);
	const [triggerPrompt, setTriggerPrompt] = useState(false);
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
			const userMessage: any = {
				id: Date.now().toString(),
				content: searchQuery.trim(),
				sender: "user",
				createdAt: new Date(),
				txnHash: null,
			};
			setUserPrompt(userMessage);
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
	const handleSendMessage = async (content: string) => {
		if (!activeChatId) return;

		const userMessage: any = {
			id: Date.now().toString(),
			content,
			sender: "user",
			createdAt: new Date(),
			txnHash: null,
		};

		// Add user message to chat
		const currentMessages = allChats || [];
		const updatedMessages = [userMessage, ...currentMessages];
		setAllChats([...updatedMessages]);
		// scrollToBottom();

		// Simulate AI response
		setIsTyping(true);

		// TODO: Replace with actual API call to your backend
		chatAgent(
			{
				token: localStorage.getItem("authToken") || "",
				prompt: content,
				threadId: activeChatId === "new" ? undefined : Number(activeChatId),
				// agentType: agentType,
			},
			{
				onSuccess: (data: any) => {
					const assistantMessage: any = {
						id: data.data.messageId,
						content: data.data.data,
						sender: "agent",
						createdAt: new Date(),
						type: data.data.type,
						userPrompt: data.data.userPrompt,
					};

					const finalMessages = [assistantMessage, ...updatedMessages];

					setAllChats([...finalMessages]);
					// scrollToBottom();
					setIsTyping(false);
					setActiveChatId(data.data.threadId);

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
			txnHash: null,
		};

		// Add user message to chat
		const currentMessages = allChats || [];
		const updatedMessages = [userMessage, ...currentMessages];
		setAllChats([...updatedMessages]);
		// scrollToBottom();

		// Simulate AI response
		setIsTyping(true);
		setTriggerPrompt(true);
		// TODO: Replace with actual API call to your backend
		chatAgent(
			{
				token: localStorage.getItem("authToken") || "",
				prompt: content,
				threadId:
					activeChatId === "new" || activeChatId === "agentType"
						? undefined
						: Number(activeChatId),
				agentType: agentType,
			},
			{
				onSuccess: (data: any) => {
					const assistantMessage: any = {
						id: data.data.messageId,
						content: data.data.data,
						sender: "agent",
						createdAt: new Date(),
						type: data.data.type,
						userPrompt: data.data.userPrompt,
						toolMessage: data.data.toolMessage,
					};

					const finalMessages = [assistantMessage, ...updatedMessages];

					setAllChats([...finalMessages]);
					// scrollToBottom();
					setIsTyping(false);
					setActiveChatId(data.data.threadId);
					// setTempThreadId(data.data.threadId);
					if (!hasFetchedOnce) {
						refetchThreads();
					}
					setHasFetchedOnce(true);
					setUserPrompt(null);
					setTriggerPrompt(false);
				},
			}
		);
	};
	useEffect(() => {
		if (tokenData) {
			setAllTokens(tokenData.data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenData]);
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
								userPrompt={userPrompt === null ? null : userPrompt}
								triggerPrompt={triggerPrompt}
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
