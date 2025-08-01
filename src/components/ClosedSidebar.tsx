/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
	MessageSquare,
	Plus,
	Grid3X3,
	Search,
	Trash2,
	Menu,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import useThreads from "../hooks/useThreads";
import useFetchAgents from "../hooks/useFetchAgents";
import { toast } from "sonner";
import useDeleteThread from "../hooks/useDeleteThread";
import { useAuth } from "../contexts/AuthContext";
import { PopupController } from "../utils/PopupController";

const ClosedSidebar = () => {
	const {
		setSelectedAgent,
		selectedAgent,
		setActiveChatId,
		setAgentType,
		setAllChats,
		setIsOpenSidebar,
		isOpenSidebar,
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
		<div className="w-15 bg-[#1B012F] text-white flex flex-col h-full border-r border-gray-800 shadow-lg">
			{/* Header */}

			<div className="p-2 border-b border-gray-700">
				{/* Tab Navigation */}
				<div className="flex bg-gray-800 rounded-lg p-1">
					<button
						className="p-2 rounded focus:outline-none focus:ring-0 hover:bg-gray-700"
						onClick={() => {
							// Implement your sidebar toggle logic here
							setIsOpenSidebar(!isOpenSidebar);
						}}
					>
						<Menu className="w-5 h-5" />
					</button>
				</div>
			</div>
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
									<div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
										{/* <span className="text-sm font-bold">M</span> */}
										<img
											src={agent.imageUrl}
											alt={agent.name}
											className="h-5 w-5 rounded-full"
										/>
									</div>
									{/* <div>
										<h4 className="font-semibold">{agent.name}</h4>
										
									</div> */}
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

			{/* Content */}
		</div>
	);
};

export default ClosedSidebar;
