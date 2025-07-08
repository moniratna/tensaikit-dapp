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
// import Link from "next/link";

const renderTokenDropdown = (
	tokenList: [],
	selectedToken: string,
	setSelectedToken: (symbol: string) => void,
	open: boolean,
	setSelectedTokenData: (data: any) => void,
	setOpen: (value: boolean) => void
) => {
	console.log("token list", tokenList);
	const selected: any = tokenList.find((t: any) => t.symbol === selectedToken);

	return (
		<div className="relative">
			<button
				className="flex items-center gap-1 text-sm text-white bg-gray-700 px-2 py-1 rounded-md"
				onClick={() => setOpen(!open)}
			>
				{selected && (
					<>
						<img
							src={selected.icon}
							className="w-4 h-4"
							width={16}
							height={16}
							alt={selected.symbol}
						/>
						<span>{selected.symbol}</span>
					</>
				)}
				<ChevronDown className="w-4 h-4" />
			</button>
			{open && (
				<div className="absolute z-20 top-8 left-0 bg-[#1a1c2b] rounded-md shadow-lg border border-gray-600 w-28">
					{tokenList.map((token: any) => (
						<button
							key={token.symbol}
							className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center gap-2"
							onClick={() => {
								setSelectedToken(token.symbol);
								setSelectedTokenData(token);
								setOpen(false);
							}}
						>
							<img
								src={token.icon}
								alt={token.symbol}
								className="w-4 h-4"
								width={16}
								height={16}
							/>
							{token.symbol}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default function ApprovalPopup({ onClose }: { onClose: () => void }) {
	const retriveToken = localStorage.getItem("authToken");
	const { data: tokenData, isLoading } = useFetchTokens(retriveToken);
	console.log(isLoading, tokenData);
	const [sellToken, setSellToken] = useState("ETH");
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
	console.log("selected sell", selectedSell);
	console.log("selected buy", selectedBuy);
	console.log("quote data", quoteData);
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
							console.log("Quote fetched successfully:", data.data);
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
						console.log("Quote fetched successfully (interval):", data.data);
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
	const {
		mutate: swapExecute,
		isSuccess: swapSuccess,
		data: swapData,
	} = useSwapToken();
	const handleSwap = () => {
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
			},
			{
				onSuccess: (data) => {
					const match = data.data.match(/0x[a-fA-F0-9]{64}/);
					const txHash = match ? match[0] : null;
					setTxnHash(txHash);
				},
			}
		);
	};
	console.log("checking swap success", swapData, swapSuccess);
	console.log("quote data", quoteData);
	return (
		<>
			{isLoading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
					<div className="text-white">Loading...</div>
				</div>
			)}
			{swapSuccess ? (
				<div className="z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<div className="bg-[#0e0f1a] rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-white">
						{/* Close Button */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-gray-400 hover:text-white"
						>
							<X />
						</button>

						{/* Success Content */}
						<div className="flex flex-col items-center text-center space-y-4">
							<div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
								<svg
									className="w-8 h-8 text-white"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>

							<p className="text-xl font-semibold">Swap Successful!</p>
							<p className="text-gray-400 text-sm">
								Your transaction has been confirmed on the blockchain.
							</p>

							{/* Optional: Add TX link */}
							{txnHash && (
								<a
									href={`https://explorer.tatara.katana.network/tx/${txnHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline text-sm"
								>
									View on Explorer
								</a>
							)}

							<button
								onClick={onClose}
								className="mt-4 w-full bg-green-700 hover:bg-green-600 py-2 rounded-md text-white"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			) : (
				<>
					{!isLoading && (
						<div className="z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
							<div className="bg-[#0e0f1a] rounded-2xl w-full max-w-md p-6 shadow-xl relative text-white">
								{/* Close Button */}
								<button
									onClick={onClose}
									className="absolute top-4 right-4 text-gray-400 hover:text-white"
								>
									<X />
								</button>

								{/* Swap Panel */}
								<div className="space-y-4">
									<p className="text-xl font-semibold mb-2">Swap</p>

									{/* Sell box */}
									<div className="bg-[#1a1c2b] rounded-lg p-4 border">
										{/* <div className="flex justify-between items-center mb-1">
									<span className="text-sm text-gray-400">Sell</span>
									<span className="text-sm text-gray-400">Balance: 0.00</span>
								</div> */}
										<div className="flex justify-between items-center text-lg font-medium">
											<div>
												<input
													type="text"
													className="bg-transparent border-none outline-none text-white w-24"
													value={amountIn}
													onChange={handleAmountChange}
												/>
												{inputError && (
													<p className="text-red-400 text-xs mt-1">
														{inputError}
													</p>
												)}
											</div>
											<div>
												{renderTokenDropdown(
													!isLoading && tokenData && tokenData.data,
													sellToken,
													setSellToken,
													sellOpen,
													setSelectedSell,
													setSellOpen
												)}
											</div>
										</div>
										{/* <div className="text-sm text-red-400 mt-1">Exceeds Balance</div> */}
									</div>

									{/* Buy box */}
									<div className="bg-[#1a1c2b] rounded-lg p-4">
										{/* <div className="flex justify-between items-center mb-1">
									<span className="text-sm text-gray-400">Buy</span>
									<span className="text-sm text-gray-400">Balance: 0.00</span>
								</div> */}
										<div className="flex justify-between items-center text-lg font-medium">
											<span className="bg-transparent border-none outline-none text-white w-24">
												{amountOut.toFixed(2)}
											</span>
											{renderTokenDropdown(
												!isLoading && tokenData && tokenData.data,
												buyToken,
												setBuyToken,
												buyOpen,
												setSelectedBuy,
												setBuyOpen
											)}
										</div>
										{/* <div className="text-sm text-gray-400 mt-1">$10.00</div> */}
									</div>

									{/* Breakdown */}
									<div className="bg-[#1a1c2b] rounded-lg p-4 space-y-1 text-sm text-gray-400">
										<div className="flex justify-between">
											<span>Price impact</span>
											<span>
												{quoteSuccess ? (
													quoteData.data.priceImpact.toFixed(4)
												) : (
													<div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>

										<div className="flex justify-between">
											<span>Max. received</span>
											<span>
												{quoteSuccess ? (
													`${(
														Number(quoteData.data.assumedAmountOut) /
														10 **
															Number(
																quoteData.data.tokens[
																	quoteData.data.tokens.length - 1
																].decimals
															)
													).toFixed(4)} ${buyToken}`
												) : (
													<div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>

										<div className="flex justify-between">
											<span>Fee (0.25%)</span>
											<span>
												{quoteSuccess ? (
													"0.25%"
												) : (
													<div className="w-12 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>

										<div className="flex justify-between">
											<span>Gas fee</span>
											<span>
												{quoteSuccess ? (
													quoteData.data.gasSpent
												) : (
													<div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>

										<div className="flex justify-between">
											<span>Routing source</span>
											<span>
												{quoteSuccess ? (
													"SushiSwap API"
												) : (
													<div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>
									</div>

									{/* Recipient */}
									{/* <div className="text-xs text-gray-500 mt-2 text-center">
								Recipient: 0x34cA...aaE3
							</div> */}

									<button
										className={`mt-4 w-full bg-blue-800 text-black hover:bg-blue-600 py-2 rounded-md border border-gray-600 ${
											quoteSuccess ? "cursor-pointer" : "cursor-not-allowed"
										}`}
										onClick={handleSwap}
										disabled={quoteSuccess ? false : true}
									>
										Place Swap
									</button>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
