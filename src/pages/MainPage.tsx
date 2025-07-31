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
import useChatMessages from "../hooks/useGetMessages";
import useGEtAgentMessages from "../hooks/useGetAgentMessages";
import ClosedSidebar from "../components/ClosedSidebar";

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
		setSelectedAgent,
		setAllTokens,
		setMessageRetry,
		setUserPrompt,
	} = useAuth();
	const { data: tokenData } = useFetchTokens(
		localStorage.getItem("authToken") || ""
	);
	const [activeTab, setActiveTab] = useState<"chat" | "protocols">("protocols");
	const [autoSearch, setAutoSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
	// const [userPrompt, setUserPrompt] = useState<any>(null);
	const [triggerPrompt, setTriggerPrompt] = useState(false);

	const { refetch } = useChatMessages(
		Number(activeChatId),
		localStorage.getItem("authToken") || "",
		activeChatId !== "new" &&
			activeChatId !== undefined &&
			activeChatId !== "agentType"
			? true
			: false
	);
	// const { data: agentMessage, refetch: refetchAgentMessage } =
	// 	useGEtAgentMessages(
	// 		agentType,
	// 		localStorage.getItem("authToken") || "",
	// 		agentType !== "" && agentType !== null ? true : false
	// 	);
	// const threadMessages = agentMessage?.pages.flatMap((page) => page.messages);
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
		// if (activeChatId !== chatId) {
		setAllChats([]);
		setHasFetchedOnce(false);
		refetch();
		// }
	};

	const handleTabChange = (tab: "chat" | "protocols") => {
		setActiveTab(tab);
		if (tab === "protocols") {
			setActiveChatId(null);
		}
	};

	// useEffect(() => {
	// 	if (autoSearch && searchQuery !== "") {
	// 		refetchAgentMessage();
	// 		const userMessage: any = {
	// 			id: Date.now().toString(),
	// 			content: searchQuery.trim(),
	// 			sender: "user",
	// 			createdAt: new Date(),
	// 			txnHash: null,
	// 		};
	// 		setUserPrompt(userMessage);
	// 		handleSendAgentMessage(searchQuery.trim(), agentType);
	// 		setAutoSearch(false);
	// 		setSearchQuery("");
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [autoSearch, searchQuery]);
	// useEffect(() => {
	// 	if (threadMessages) {
	// 		if (allChats.length === 0) {
	// 			setAllChats([...threadMessages]);
	// 		}
	// 	}
	// }, [agentMessage]);
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
		// const currentMessages = allChats || [];
		// const updatedMessages = [userMessage, ...currentMessages];
		// setAllChats([...updatedMessages]);
		setAllChats((prevChats) => [userMessage, ...prevChats]);
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

					const newUserMessage: any = {
						id: data.data.agentMessageId,
						content,
						sender: "user",
						createdAt: new Date(),
						txnHash: null,
					};
					const newCurrentMessages = allChats || [];
					const newUpdatedMessages = [newUserMessage, ...newCurrentMessages];
					const finalMessages = [assistantMessage, ...newUpdatedMessages];
					if (allChats.length > 1) {
						setAllChats([...finalMessages]);
					} else {
						setAllChats([]);
					}

					// scrollToBottom();
					setIsTyping(false);
					setActiveChatId(data.data.threadId);

					if (!hasFetchedOnce) {
						refetchThreads();
					}
					setHasFetchedOnce(true);
				},
				onError: () => {
					setIsTyping(false);
					setActiveChatId(null);
					setActiveTab("chat");
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
		console.log("Current Messages:", currentMessages);
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

					const userMessage: any = {
						id: data.data.agentMessageId,
						content,
						sender: "user",
						createdAt: new Date(),
						txnHash: null,
					};
					const currentMessages = allChats || [];
					const newUpdatedMessages = [userMessage, ...currentMessages];
					const finalMessages = [assistantMessage, ...newUpdatedMessages];

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
				onError: () => {
					setMessageRetry(userMessage.id);
					setIsTyping(false);
				},
			}
		);
	};
	const handleSendRetryAgentMessage = async (
		id: string,
		agentType?: string
	) => {
		const message = allChats.find((item) => item.id === id);
		if (message) {
			// Simulate AI response
			setIsTyping(true);
			setTriggerPrompt(true);
			// TODO: Replace with actual API call to your backend
			chatAgent(
				{
					token: localStorage.getItem("authToken") || "",
					prompt: message.content,
					threadId:
						activeChatId === "new" || activeChatId === "agentType"
							? undefined
							: Number(activeChatId),
					agentType: agentType,
				},
				{
					onSuccess: (data: any) => {
						setMessageRetry("");
						const assistantMessage: any = {
							id: data.data.messageId,
							content: data.data.data,
							sender: "agent",
							createdAt: new Date(),
							type: data.data.type,
							userPrompt: data.data.userPrompt,
							toolMessage: data.data.toolMessage,
						};

						const userMessage: any = {
							id: data.data.agentMessageId,
							content: message.content,
							sender: "user",
							createdAt: new Date(),
							txnHash: null,
						};
						const currentMessages = allChats || [];
						const newUpdatedMessages = [...currentMessages];
						const finalMessages = [assistantMessage, ...newUpdatedMessages];

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
					onError: (error) => {
						setMessageRetry(id);
						setIsTyping(false);
					},
				}
			);
		}
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
			) : (
				<ClosedSidebar />
			)}

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
								handleSendRetryAgentMessage={handleSendRetryAgentMessage}
							/>
						) : (
							<ProtocolsPage
								setAutoSearch={setAutoSearch}
								setSearchQuery={setSearchQuery}
								setAgentType={setAgentType}
								handleSendMessage={handleSendAgentMessage}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default MainPage;
