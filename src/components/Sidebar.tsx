/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { MessageSquare, Plus, Grid3X3, Search, Trash2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import useThreads from "../hooks/useThreads";
import useFetchAgents from "../hooks/useFetchAgents";
import { toast } from "sonner";
import useDeleteThread from "../hooks/useDeleteThread";
import { useAuth } from "../contexts/AuthContext";
import { PopupController } from "../utils/PopupController";

interface SidebarProps {
	activeChatId: string | null;
	onChatSelect: (chatId: string) => void;
	onNewChat: () => void;
	activeTab: "chat" | "protocols";
	onTabChange: (tab: "chat" | "protocols") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
	activeChatId,
	onChatSelect,
	onNewChat,
	activeTab,
	onTabChange,
}) => {
	const {
		setSelectedAgent,
		selectedAgent,
		setActiveChatId,
		setAgentType,
		setAllChats,
	} = useAuth();
	const [searchQuery, setSearchQuery] = useState("");
	const { data: protocolData } = useFetchAgents(
		localStorage.getItem("authToken") || ""
	);

	const {
		data: threads,
		isFetchingNextPage,
		fetchNextPage,
		isFetching,
		hasNextPage,
		refetch,
	} = useThreads(localStorage.getItem("authToken") || "", true);

	const allThreads = threads
		? threads.pages.flatMap((d: any) => d.threads)
		: [];
	const filteredChats = allThreads.filter((chat) =>
		chat.title.toLowerCase().includes(searchQuery.toLowerCase())
	);
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView && !isFetching && hasNextPage) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, isFetching, hasNextPage]);
	const { mutate: deleteThread } = useDeleteThread();

	return (
		// <div className="w-80 bg-[#1B012F] text-white flex flex-col h-full">
		<div className="w-64 bg-[#1B012F] text-white flex flex-col h-full border-r border-gray-800 shadow-lg">
			{/* Header */}

			<div className="p-4 border-b border-gray-700">
				{/* Tab Navigation */}
				<div className="flex bg-gray-800 rounded-lg p-1">
					<button
						onClick={() => {
							setAllChats([]);
							onTabChange("protocols");
							setSelectedAgent("");
						}}
						className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
							activeTab === "protocols"
								? "bg-[#ffc300] text-black"
								: "text-gray-300 hover:text-white hover:bg-gray-700"
						}`}
					>
						<Grid3X3 className="h-4 w-4 mr-2" />
						Protocols
					</button>
					<button
						onClick={() => {
							PopupController.trigger({
								title: "Coming Soon!",
								description: `Our chat feature is almost ready! Stay tuned for an interactive experience coming your way soon.`,
								// contactEmail: "contact@tensaikit.xyz",
								icon: "info",
								onButtonClick: () => {
									window.open("https://google.com", "_blank");
								},
							});
							// setAllChats([]);
							// onTabChange("chat");
							// setSelectedAgent("");
							// setActiveChatId(null);
						}}
						className={`flex-1 flex items-center justify-center py-1 px-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-0 ${
							activeTab === "chat"
								? "bg-[#ffc300] text-black"
								: "text-gray-300 hover:text-white hover:bg-gray-700"
						}`}
					>
						<MessageSquare className="h-4 w-4 mr-2" />
						Chats
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-hidden">
				{activeTab === "chat" ? (
					<div className="h-full flex flex-col">
						{/* New Chat Button */}
						<div className="p-4">
							<button
								onClick={onNewChat}
								className="w-full flex items-center text-black justify-center py-1 px-4 bg-gradient-to-r from-[#ffc300] to-[#faa300] hover:from-[#faa300] hover:to-[#ffc300] rounded-lg font-normal transition-all"
							>
								<Plus className="h-4 w-4 mr-2" />
								New Chat
							</button>
						</div>

						{/* Search */}
						<div className="px-4 pb-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<input
									type="text"
									placeholder="Search conversations..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Chat List */}
						<div className="flex-1 overflow-y-auto px-2 space-y-1">
							{filteredChats.map((chat: any) => (
								<button
									key={chat.id}
									onClick={() => {
										if (chat.id !== activeChatId) {
											onChatSelect(chat.id);
										}
									}}
									className={`w-full text-left p-1 rounded-md transition-colors focus:outline-none focus:ring-0 ${
										activeChatId === chat.id
											? "bg-gray-800 text-gray-200"
											: "hover:bg-gray-800 text-gray-300"
									}`}
								>
									<div className="font-medium text-sm truncate mb-1 hover:pr-5 ">
										{chat.title}
										<button
											onClick={(e) => {
												e.stopPropagation();
												toast.custom(
													(t) => (
														<div className="flex flex-col gap-2 p-2 bg-white rounded-md">
															<div className="text-sm text-black">
																Are you sure you want to delete?
															</div>
															<div className="flex justify-end gap-2">
																<button
																	onClick={() => toast.dismiss(t)}
																	className="px-3 py-1 text-sm rounded-md border border-gray-600 text-gray-700 hover:bg-gray-200"
																>
																	Cancel
																</button>
																<button
																	onClick={() => {
																		deleteThread(
																			{
																				token:
																					localStorage.getItem("authToken"),
																				threadId: chat.id,
																			},
																			{
																				onSuccess: () => {
																					toast.success("Deleted!");
																					toast.dismiss(t);
																					setActiveChatId(null);
																					setSelectedAgent("");
																					refetch();
																				},
																			}
																		);
																	}}
																	className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white"
																>
																	Delete
																</button>
															</div>
														</div>
													),
													{
														duration: 10000,
														position: "top-right",
													}
												);
											}}
											className="absolute h-5 right-2 text-gray-100 hover:text-white opacity-0 hover:opacity-100 transition-opacity"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>

									{/* <div className="text-xs">{formatDate(chat.createdAt)}</div> */}
								</button>
							))}
							<div ref={ref} className="w-full text-center text-white">
								{isFetchingNextPage && hasNextPage ? "Loading..." : <></>}
							</div>
							{filteredChats.length === 0 && (
								<div className="text-center text-gray-400 py-8">
									<MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
									<p className="text-sm">No conversations yet</p>
									<p className="text-xs mt-1">Start a new chat to begin</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="p-4">
						<h3 className="text-lg font-semibold mb-4">DeFi Agents</h3>

						<div className="space-y-3">
							{protocolData &&
								protocolData.agents
									.filter((agent: any) => agent.name !== "Morpho")
									.map((agent: any) => (
										<div
											key={agent.id}
											className={
												selectedAgent === agent.name.toLowerCase()
													? "bg-[#fcc300] rounded-lg p-4 hover:bg-[#fbb300] transition-colors cursor-pointer text-black"
													: `bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer`
											}
											onClick={() => {
												// setAllChats([]);
												setSelectedAgent(agent.name.toLowerCase());
												setActiveChatId("agentType");
												setAgentType(agent.name.toLowerCase());
											}}
										>
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
													{/* <span className="text-sm font-bold">M</span> */}
													<img
														src={agent.imageUrl}
														alt={agent.name}
														className="h-10 w-10 rounded-full"
													/>
												</div>
												<div>
													<h4 className="font-semibold">{agent.name}</h4>
													{/* <p className="text-sm text-gray-400">Lending Protocol</p> */}
												</div>
											</div>
										</div>
									))}

							{/* <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
										<span className="text-sm font-bold">S</span>
									</div>
									<div>
										<h4 className="font-semibold">SushiSwap</h4>
										<p className="text-sm text-gray-400">DEX Protocol</p>
									</div>
								</div>
							</div> */}
						</div>
					</div>
				)}
			</div>

			{/* User Section */}
			{/* <div className="p-4 border-t border-gray-700">
				<div className="flex items-center space-x-3 mb-3">
					<div className="w-8 h-8 bg-gradient-to-r from-[#fbb300] to-[#fac900] rounded-full flex items-center justify-center">
						<User className="h-4 w-4 text-white" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">{user?.name}</p>
						<p className="text-xs text-gray-400 truncate">{user?.email}</p>
					</div>
				</div>

				<div className="flex space-x-2">
					<button
						title={user?.walletAddress}
						onClick={() => {
							if (user?.walletAddress) {
								navigator.clipboard.writeText(user.walletAddress);
								toast("Wallet address copied to clipboard");
							}
						}}
						className="flex-1 flex items-center justify-center py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
					>
						<Copy className="h-4 w-4 mr-2" />
						{user &&
							`${user.walletAddress.slice(0, 5)}...${user.walletAddress.slice(
								-4
							)}`}
					</button>
					<button
						onClick={logout}
						className="flex-1 flex items-center justify-center py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
					>
						<LogOut className="h-4 w-4 mr-2" />
						Logout
					</button>
				</div>
			</div> */}
		</div>
	);
};

export default Sidebar;
