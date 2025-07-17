/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { CustomSession } from "@/app/api/auth/[...nextauth]/options";
// import Cookies from "js-cookie";
import Alert from "./Alert";
import useFetchTokens from "../hooks/useFetchTokens";
import useGetQuotes from "../hooks/useGetQuotes";
import useSwapToken from "../hooks/useSwapToken";
import { toast } from "sonner";
const allVaults = Array.from({ length: 20 }, (_, i) => ({
	name: `Vault ${i + 1}`,
	icon: "/icons/usdc.svg",
	supply: `${(500_000_000 - i * 10_000_000).toLocaleString()} USDC`,
	supplyShort: `$${(500 - i * 10).toFixed(1)}m`,
	apy: `${(Math.random() * 8).toFixed(2)}%`,
	curator: i % 2 === 0 ? "SparkDAO" : "Block Analitica + B.Protocol",
	curatorIcon: "/icons/sparkdao.svg",
}));
export default function MorphoPopup({
	onClose,
	messageId,
}: {
	onClose: () => void;
	messageId: number;
}) {
	const [showAll, setShowAll] = useState(false);

	const visibleVaults = showAll ? allVaults : allVaults.slice(0, 5);
	const retriveToken = localStorage.getItem("authToken");
	const { data: tokenData, isLoading } = useFetchTokens(retriveToken);
	const [sellToken, setSellToken] = useState("USDT");
	const [buyToken, setBuyToken] = useState("AUSD");
	const [buyOpen, setBuyOpen] = useState(false);
	const [sellOpen, setSellOpen] = useState(false);
	const [amountIn, setAmountIn] = useState("1");
	const [amountOut, setAmountOut] = useState(0);
	type TokenType = {
		id: string;
		symbol: string;
		icon: string;
		// add other properties if needed
	};

	const [selectedSell, setSelectedSell] = useState<TokenType | null>(null);
	const [selectedBuy, setSelectedBuy] = useState<TokenType | null>(null);
	const [inputError, setInputError] = useState("");
	const [txnHash, setTxnHash] = useState<string | null>(null);
	const [isSwapping, setIsSwapping] = useState(false);
	const {
		mutate: fetchQuote,
		data: quoteData,
		isSuccess: quoteSuccess,
	} = useGetQuotes();

	useEffect(() => {
		if (tokenData && tokenData.data) {
			const initialSellToken = tokenData.data.find(
				(token: any) => token.symbol === sellToken
			);
			const initialBuyToken = tokenData.data.find(
				(token: any) => token.symbol === buyToken
			);
			if (initialSellToken) {
				setSelectedSell(initialSellToken);
			}
			if (initialBuyToken) {
				setSelectedBuy(initialBuyToken);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenData]);

	useEffect(() => {
		// implement debounce for fetching quote
		if (selectedSell && selectedBuy) {
			setTimeout(() => {
				fetchQuote(
					{
						token: retriveToken,
						amountIn: Number(amountIn),
						sellTokenId: selectedSell.id,
						buyTokenId: selectedBuy.id,
					},
					{
						onSuccess: (data) => {
							// Handle the quote data as needed
							setAmountOut(
								Number(data.data.assumedAmountOut) /
									10 **
										Number(
											data.data.tokens[data.data.tokens.length - 1].decimals
										)
							);
						},
						onError: (error) => {
							console.error("Error fetching quote:", error);
						},
					}
				);
			}, 2000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [amountIn, selectedSell, selectedBuy]);

	useEffect(() => {
		if (!selectedSell || !selectedBuy) return;

		const interval = setInterval(() => {
			fetchQuote(
				{
					token: retriveToken,
					amountIn: Number(amountIn),
					sellTokenId: selectedSell.id,
					buyTokenId: selectedBuy.id,
				},
				{
					onSuccess: (data) => {
						setAmountOut(
							Number(data.data.assumedAmountOut) /
								10 **
									Number(data.data.tokens[data.data.tokens.length - 1].decimals)
						);
					},
					onError: (error) => {
						console.error("Error fetching quote:", error);
					},
				}
			);
		}, 30000); // 30 seconds

		return () => clearInterval(interval); // Cleanup
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSell, selectedBuy, amountIn, retriveToken]);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Regex to match numbers or empty string
		if (value === "" || value === "." || /^\d*\.?\d*$/.test(value)) {
			setAmountIn(value);
			setInputError("");
		} else {
			setInputError("Only numbers are accepted");
		}
	};
	const { mutate: swapExecute, isSuccess: swapSuccess } = useSwapToken();
	const handleSwap = () => {
		setIsSwapping(true);
		if (!selectedSell || !selectedBuy) {
			return (
				<Alert
					type="error"
					title="Error"
					message="Please select tokens to swap"
				/>
			);
		}
		if (Number(amountIn) <= 0) {
			setInputError("Amount must be greater than 0");
			return;
		}
		swapExecute(
			{
				token: retriveToken,
				sellTokenId: selectedSell.id,
				buyTokenId: selectedBuy.id,
				amountIn: Number(amountIn),
				messageId: messageId,
			},
			{
				onSuccess: (data) => {
					const match = data.data.match(/0x[a-fA-F0-9]{64}/);
					const txHash = match ? match[0] : null;
					setTxnHash(txHash);
					toast.success("Swap successful!");
					setIsSwapping(false);
				},
				onError: (error) => {
					console.error("Error swapping tokens:", error);
					toast.error("Swap failed!");
					setIsSwapping(false);
				},
			}
		);
	};
	// return (
	// 	<>
	// 		{isLoading && (
	// 			<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
	// 				<div className="text-white">Loading...</div>
	// 			</div>
	// 		)}
	// 		{swapSuccess ? (
	// 			<div className="z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
	// 				<div className="bg-[#0e0f1a] rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-white">
	// 					{/* Close Button */}
	// 					{/* <button
	// 						onClick={onClose}
	// 						className="absolute top-4 right-4 text-gray-400 hover:text-white"
	// 					>
	// 						<X />
	// 					</button> */}

	// 					{/* Success Content */}
	// 					<div className="flex flex-col items-center text-center space-y-4">
	// 						<div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
	// 							<svg
	// 								className="w-8 h-8 text-white"
	// 								fill="none"
	// 								stroke="currentColor"
	// 								strokeWidth="2"
	// 								viewBox="0 0 24 24"
	// 							>
	// 								<path
	// 									strokeLinecap="round"
	// 									strokeLinejoin="round"
	// 									d="M5 13l4 4L19 7"
	// 								/>
	// 							</svg>
	// 						</div>

	// 						<p className="text-xl font-semibold">Swap Successful!</p>
	// 						<p className="text-gray-400 text-sm">
	// 							Your transaction has been confirmed on the blockchain.
	// 						</p>

	// 						{/* Optional: Add TX link */}
	// 						{txnHash && (
	// 							<a
	// 								href={`https://explorer.tatara.katana.network/tx/${txnHash}`}
	// 								target="_blank"
	// 								rel="noopener noreferrer"
	// 								className="text-blue-500 underline text-sm"
	// 							>
	// 								View on Explorer
	// 							</a>
	// 						)}

	// 						{/* <button
	// 							onClick={onClose}
	// 							className="mt-4 w-full bg-green-700 hover:bg-green-600 py-2 rounded-md text-white"
	// 						>
	// 							Close
	// 						</button> */}
	// 					</div>
	// 				</div>
	// 			</div>
	// 		) : (
	// 			<>
	// 				{!isLoading && (
	// 					<div className="z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm w-full rounded-xl">
	// 						<div className="bg-[#0e0f1a] rounded-2xl w-full max-w-md p-6 shadow-xl relative text-white">
	// 							{/* Close Button */}
	// 							{/* <button
	// 								onClick={onClose}
	// 								className="absolute top-4 right-4 text-gray-400 hover:text-white"
	// 							>
	// 								<X />
	// 							</button> */}

	// 							{/* Swap Panel */}
	// 							<div className="space-y-4">
	// 								<p className="text-xl font-semibold mb-2">Dynamic Approval</p>

	// 								{/* Sell box */}
	// 								<div className="bg-[#1a1c2b] rounded-lg p-4 border">
	// 									{/* <div className="flex justify-between items-center mb-1">
	// 								<span className="text-sm text-gray-400">Sell</span>
	// 								<span className="text-sm text-gray-400">Balance: 0.00</span>
	// 							</div> */}
	// 									<div className="flex justify-between items-center text-lg font-medium">
	// 										<div>
	// 											<span className="text-gray-400 text-sm">
	// 												Market Address
	// 											</span>
	// 											<input
	// 												type="text"
	// 												className="bg-transparent border-none outline-none text-white w-80"
	// 												value={amountIn}
	// 												onChange={handleAmountChange}
	// 											/>
	// 											{inputError && (
	// 												<p className="text-red-400 text-xs mt-1">
	// 													{inputError}
	// 												</p>
	// 											)}
	// 										</div>
	// 									</div>
	// 									{/* <div className="text-sm text-red-400 mt-1">Exceeds Balance</div> */}
	// 								</div>

	// 								{/* Buy box */}
	// 								<div className="bg-[#1a1c2b] rounded-lg p-4">
	// 									{/* <div className="flex justify-between items-center mb-1">
	// 								<span className="text-sm text-gray-400">Buy</span>
	// 								<span className="text-sm text-gray-400">Balance: 0.00</span>
	// 							</div> */}
	// 									<div className="flex justify-between items-center text-lg font-medium">
	// 										<div>
	// 											<span className="text-gray-400 text-sm">
	// 												Market Address
	// 											</span>
	// 											<input
	// 												type="text"
	// 												className="bg-transparent border-none outline-none text-white w-80"
	// 												value={amountIn}
	// 												onChange={handleAmountChange}
	// 											/>
	// 											{inputError && (
	// 												<p className="text-red-400 text-xs mt-1">
	// 													{inputError}
	// 												</p>
	// 											)}
	// 										</div>
	// 									</div>
	// 									{/* <div className="text-sm text-gray-400 mt-1">$10.00</div> */}
	// 								</div>

	// 								{/* Breakdown */}

	// 								<button
	// 									className={`mt-4 w-full bg-[#fcc300] text-black hover:bg-[#faa300] py-2 rounded-md border border-gray-600 flex items-center justify-center gap-2 ${
	// 										quoteSuccess ? "cursor-pointer" : "cursor-not-allowed"
	// 									} ${
	// 										isSwapping
	// 											? "cursor-not-allowed bg-gray-600 hover:bg-gray-600"
	// 											: ""
	// 									}`}
	// 									onClick={handleSwap}
	// 									disabled={isSwapping}
	// 								>
	// 									{isSwapping && (
	// 										<svg
	// 											className="animate-spin h-5 w-5 text-white"
	// 											xmlns="http://www.w3.org/2000/svg"
	// 											fill="none"
	// 											viewBox="0 0 24 24"
	// 										>
	// 											<circle
	// 												className="opacity-25"
	// 												cx="12"
	// 												cy="12"
	// 												r="10"
	// 												stroke="currentColor"
	// 												strokeWidth="4"
	// 											></circle>
	// 											<path
	// 												className="opacity-75"
	// 												fill="currentColor"
	// 												d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
	// 											></path>
	// 										</svg>
	// 									)}
	// 									{isSwapping ? "Approving..." : "Approve"}
	// 								</button>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				)}
	// 			</>
	// 		)}
	// 	</>
	// );
	return (
		<div className="bg-[#1c1c1c] text-white max-w-6xl mx-auto p-4 rounded-lg shadow-md">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b border-gray-700">
				<div className="flex items-center gap-2">
					<img src="/icons/morpho.svg" alt="Morpho" className="w-6 h-6" />
					<h2 className="text-xl font-semibold">Morpho</h2>
				</div>
				<button className="bg-[#2c2c2c] px-3 py-1 rounded-full text-sm">
					Base
				</button>
			</div>

			{/* Table Header */}
			<div className="grid grid-cols-6 text-sm text-gray-400 py-3 border-b border-gray-700 mt-2">
				<div className="col-span-2">Vault</div>
				<div>Total Supply</div>
				<div>APY</div>
				<div>Curator</div>
				<div></div>
			</div>

			{/* Vault Rows */}
			{visibleVaults.map((vault, idx) => (
				<div
					key={idx}
					className="grid grid-cols-6 items-center py-4 border-b border-gray-700 text-sm"
				>
					{/* Vault Info */}
					<div className="col-span-2 flex items-center gap-2">
						<img src={vault.icon} alt={vault.name} className="w-5 h-5" />
						<span>{vault.name}</span>
					</div>

					{/* Supply */}
					<div>
						<div>{vault.supply}</div>
						<div className="text-gray-400">{vault.supplyShort}</div>
					</div>

					{/* APY */}
					<div className="text-green-400 font-medium">{vault.apy}</div>

					{/* Curator */}
					<div className="flex items-center gap-2">
						<img
							src={vault.curatorIcon}
							alt={vault.curator}
							className="w-4 h-4"
						/>
						<span className="truncate">{vault.curator}</span>
					</div>

					{/* Supply Button */}
					<div className="text-right">
						<button className="bg-[#2c2c2c] px-4 py-2 rounded-full hover:bg-[#3c3c3c]">
							Supply
						</button>
					</div>
				</div>
			))}

			{/* See More / See Less */}
			{allVaults.length > 5 && (
				<div className="flex justify-center py-3">
					<button
						className="text-sm text-gray-300 hover:underline flex items-center gap-1"
						onClick={() => setShowAll((prev) => !prev)}
					>
						{showAll ? "See Less" : "See More"}
						<ChevronDown
							className={`w-4 h-4 transition-transform ${
								showAll ? "rotate-180" : ""
							}`}
						/>
					</button>
				</div>
			)}
		</div>
	);
}
