/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import useFetchAgents from "../hooks/useFetchAgents";
import { useAuth } from "../contexts/AuthContext";

interface ProtocolPageProps {
	setAutoSearch: (value: boolean) => void;
	setSearchQuery: (query: string) => void;
	setAgentType: (type: string) => void;
}
const ProtocolsPage: React.FC<ProtocolPageProps> = ({
	setAutoSearch,
	setSearchQuery,
	setAgentType,
}) => {
	const retriveToken = localStorage.getItem("authToken");
	const { data: agentData } = useFetchAgents(retriveToken);
	const [expandedPrompts, setExpandedPrompts] = useState<number[]>([]);
	const { setActiveChatId, setSelectedAgent } = useAuth();
	const togglePrompts = (agentId: number) => {
		setExpandedPrompts((prev) =>
			prev.includes(agentId)
				? prev.filter((id) => id !== agentId)
				: [...prev, agentId]
		);
	};
	const handleStartAgent = (protocol: string) => {
		if (protocol) {
			setSelectedAgent(protocol.toLowerCase());
		}
	};
	useEffect(() => {
		setActiveChatId("agentType");
	});

	const searchPrompts = (prompt: string, protocol: string) => {
		setAutoSearch(true);
		setSearchQuery(prompt);
		setAgentType(protocol.toLowerCase());
		setSelectedAgent(protocol.toLowerCase());
		// if (prompt.trim() && activeChatId !== null) {
		// 	handleSendMessage(prompt.trim());
		// }
	};

	return (
		<div className="flex-1 overflow-y-auto bg-[#1B012F]">
			<div className="max-w-6xl mx-auto p-6 space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold text-[#ffc300]">DeFi Agents</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Explore and interact with leading decentralized finance protocols.
						Access real-time data, analytics, and seamless integrations.
					</p>
				</div>

				{/* Protocol Cards */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{agentData &&
						agentData.agents.map((protocol: any) => (
							<div
								key={protocol.id}
								className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
							>
								{/* Card Header */}
								<div className="p-6 bg-gradient-to-r">
									<div className="flex items-start justify-between">
										<div className="flex items-center space-x-4">
											<div
												className={`w-8 h-8 ${protocol.logoColor} rounded-2xl flex items-center justify-center shadow-lg`}
											>
												{/* <span className="text-2xl font-bold text-white">
													{protocol.imageUrl}
												</span> */}
												<img src={protocol.imageUrl} alt={protocol.name} />
											</div>
											<div>
												<h3 className="text-2xl font-bold text-[#ffc300]">
													{protocol.name}
												</h3>
												{/* <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
													{protocol.category}
												</span> */}
											</div>
										</div>
										{/* <a
											href={protocol.website}
											target="_blank"
											rel="noopener noreferrer"
											className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
											title="Visit website"
										>
											<ExternalLink className="h-5 w-5" />
										</a> */}
									</div>
								</div>

								{/* Card Content */}
								<div className="p-2 space-y-2">
									<p className="text-gray-500 leading-relaxed">
										{protocol.description}
									</p>

									{/* Stats */}
									{/* <div className="grid grid-cols-3 gap-4">
										<div className="text-center p-4 bg-gray-500 rounded-xl">
											<div className="flex items-center justify-center mb-2">
												<DollarSign className="h-5 w-5 text-green-600" />
											</div>
											<div className="text-2xl font-bold text-gray-900">
												{protocol.tvl}
											</div>
											<div className="text-sm text-gray-500">TVL</div>
										</div>
										<div className="text-center p-4 bg-gray-50 rounded-xl">
											<div className="flex items-center justify-center mb-2">
												<TrendingUp className="h-5 w-5 text-blue-600" />
											</div>
											<div className="text-2xl font-bold text-gray-900">
												{protocol.apy}
											</div>
											<div className="text-sm text-gray-500">APY</div>
										</div>
										<div className="text-center p-4 bg-gray-50 rounded-xl">
											<div className="flex items-center justify-center mb-2">
												<Users className="h-5 w-5 text-purple-600" />
											</div>
											<div className="text-2xl font-bold text-gray-900">
												{protocol.users}
											</div>
											<div className="text-sm text-gray-500">Users</div>
										</div>
									</div> */}

									{/* Features */}
									<div>
										<h4 className="font-semibold text-gray-400 mb-3">
											Key Features
										</h4>
										<div className="grid grid-cols-2 gap-2">
											{protocol.features.map((feature: any, index: any) => (
												<div
													key={index}
													className="flex items-center space-x-2 pl-2"
												>
													<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
													<span className="text-sm text-gray-600">
														{feature}
													</span>
												</div>
											))}
										</div>
									</div>

									{/* Actions */}
									<div className="flex space-x-3 pt-4">
										{/* <button className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
											Connect Wallet
										</button>
										<button className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
											View Analytics
										</button> */}
										<div>
											<div className="flex items-center justify-between mb-3">
												<h4 className="text-gray-400 text-sm font-medium">
													Suggested Prompts
												</h4>
												<button
													// variant="ghost"
													// size="sm"
													className="flex text-gray-400 hover:text-white p-2 h-auto"
													onClick={() => togglePrompts(protocol.id)}
												>
													<span className="text-xs">See More</span>
													<ChevronDown
														className={`w-3 h-3 ml-1 transition-transform ${
															expandedPrompts.includes(protocol.id)
																? "rotate-180"
																: ""
														}`}
													/>
												</button>
											</div>

											<div className="grid grid-cols-1 gap-2">
												{protocol.prompts
													.slice(
														0,
														expandedPrompts.includes(protocol.id)
															? undefined
															: 3
													)
													.map((prompt: any, index: any) => (
														<button
															key={index}
															// variant="ghost"
															className="flex justify-start text-left h-auto p-3 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg"
															onClick={() =>
																searchPrompts(prompt, protocol.name)
															}
														>
															<Search className="w-4 h-4 text-purple-400 flex-shrink-0 mr-2" />
															<span className="text-sm text-white dark:text-gray-300 truncate">
																{prompt}
															</span>
														</button>
													))}
											</div>
										</div>
									</div>
									<div className="flex justify-center pt-4">
										<button
											className="bg-[#fcc300] text-black px-4 py-3 rounded-lg font-medium hover:bg-[#fbb300] transition-colors"
											onClick={() => handleStartAgent(protocol.name)}
										>
											Start Agent
										</button>
									</div>
								</div>
							</div>
						))}
				</div>

				{/* Coming Soon Section */}
			</div>
		</div>
	);
};

export default ProtocolsPage;
