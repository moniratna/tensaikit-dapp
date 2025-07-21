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
import useFetchTokenPrice from "../hooks/useFetchTokenPrice";
// import Link from "next/link";

const tokenList = [
	{
		address: "0xee7d8bcfb72bc1880d0cf19822eb0a2e6577ab62",
		symbol: "WETH",
		name: "Wrapped Ether",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x203a662b0bd271a6ed5a60edfbd04bfce608fd36",
		symbol: "USDC",
		name: "Vault Bridge USDC",
		decimals: 6,
		approved: true,
	},
	{
		address: "0x0913da6da4b42f538b445599b46bb4622342cf52",
		symbol: "WBTC",
		name: "Vault Bridge WBTC",
		decimals: 8,
		approved: true,
	},
	{
		address: "0x00000000efe302beaa2b3e6e1b18d08d69a9012a",
		symbol: "AUSD",
		name: "AUSD",
		decimals: 6,
		approved: true,
	},
	{
		address: "0x2dca96907fde857dd3d816880a0df407eeb2d2f2",
		symbol: "USDT",
		name: "Vault Bridge USDT",
		decimals: 6,
		approved: true,
	},
	{
		address: "0x9b8df6e244526ab5f6e6400d331db28c8fdddb55",
		symbol: "uSOL",
		name: "Solana (Universal)",
		decimals: 18,
		approved: true,
	},
	{
		address: "0xb24e3035d1fcbc0e43cf3143c3fd92e53df2009b",
		symbol: "POL",
		name: "Polygon Ecosystem Token",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x7fb4d0f51544f24f385a421db6e7d4fc71ad8e5c",
		symbol: "wstETH",
		name: "Wrapped liquid staked Ether 2.0",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x6c16e26013f2431e8b2e1ba7067ecccad0db6c52",
		symbol: "JitoSOL",
		name: "Jito Staked SOL",
		decimals: 18,
		approved: true,
	},
	{
		address: "0xecac9c5f704e954931349da37f60e39f515c11c1",
		symbol: "LBTC",
		name: "Lombard Staked Bitcoin",
		decimals: 8,
		approved: true,
	},
	{
		address: "0xb0f70c0bd6fd87dbeb7c10dc692a2a6106817072",
		symbol: "BTCK",
		name: "Bitcoin on Katana",
		decimals: 8,
		approved: true,
	},
	{
		address: "0x7f1f4b4b29f5058fa32cc7a97141b8d7e5abdc2d",
		symbol: "KAT",
		name: "Katana Network Token",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x9893989433e7a383cb313953e4c2365107dc19a7",
		symbol: "weETH",
		name: "Wrapped eETH",
		decimals: 18,
		approved: true,
	},
	{
		address: "0xb0505e5a99abd03d94a1169e638b78edfed26ea4",
		symbol: "uSUI",
		name: "Sui (Universal)",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x17bff452dae47e07cea877ff0e1aba17eb62b0ab",
		symbol: "SUSHI",
		name: "SushiToken",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x62d6a123e8d19d06d68cf0d2294f9a3a0362c6b3",
		symbol: "USDS",
		name: "Vault Bridge USDS",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x476eacd417cd65421bd34fca054377658bb5e02b",
		symbol: "YFI",
		name: "yearn.finance",
		decimals: 18,
		approved: true,
	},
	{
		address: "0x1e5efca3d0db2c6d5c67a4491845c43253eb9e4e",
		symbol: "MORPHO",
		name: "Morpho Token",
		decimals: 18,
		approved: true,
	},
];

const renderTokenDropdown = (
	tokenList: [],
	selectedToken: string,
	setSelectedToken: (symbol: string) => void,
	open: boolean,
	setSelectedTokenData: (data: any) => void,
	setOpen: (value: boolean) => void,
	disableToken: string,
	mutationFn: (data: any, options?: any) => void,
	setPrice: (price: number) => void
) => {
	const retriveToken = localStorage.getItem("authToken");
	const selected: any = tokenList.find((t: any) => t.symbol === selectedToken);

	return (
		<div className="relative">
			<button
				className="flex items-center gap-1 text-sm text-white bg-gray-700 px-2 py-1 rounded-lg"
				onClick={() => setOpen(!open)}
			>
				{selected && (
					<>
						<img
							src={`https://cdn.sushi.com/image/upload/f_auto,c_limit,w_40/d_unknown.png/tokens/747474/${selected.address}.jpg`}
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
				<div className="absolute h-40 w-auto z-20 top-8 left-0 bg-[#1a1c2b] rounded-md shadow-lg border border-gray-400 overflow-auto">
					{tokenList.map((token: any) => {
						return (
							<>
								{token.symbol.toUpperCase() !== disableToken && (
									<button
										key={token.symbol}
										className="w-full text-sm text-center px-2 py-2 hover:bg-[#fcc300] hover:text-black flex items-center gap-2"
										onClick={() => {
											setSelectedToken(token.symbol);
											setSelectedTokenData(token);
											setOpen(false);
											mutationFn(
												{
													tokenAddress: [token.address],
													token: retriveToken,
												},
												{
													onSuccess: (data: any) => {
														setPrice(data.data[token.address]);
													},
												}
											);
										}}
									>
										<img
											src={`https://cdn.sushi.com/image/upload/f_auto,c_limit,w_40/d_unknown.png/tokens/747474/${token.address}.jpg`}
											alt={token.symbol}
											className="w-4 h-4 rounded-full"
											width={16}
											height={16}
										/>
										{token.symbol}
									</button>
								)}
							</>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default function ApprovalPopup({
	onClose,
	messageId,
	setPopupOpened,
	content,
}: {
	onClose: () => void;
	messageId: number;
	setPopupOpened: (value: boolean) => void;
	content: string;
}) {
	const retriveToken = localStorage.getItem("authToken");
	const { data: tokenData, isLoading } = useFetchTokens(retriveToken);
	const { mutate: tokenMutation } = useFetchTokenPrice();
	const [sellToken, setSellToken] = useState("USDT");
	const [buyToken, setBuyToken] = useState("AUSD");
	const [buyOpen, setBuyOpen] = useState(false);
	const [sellOpen, setSellOpen] = useState(false);
	const [amountIn, setAmountIn] = useState("1");
	const [amountOut, setAmountOut] = useState(0);

	const extractTwoTokenNames = (text: string) => {
		const found = [];

		// Convert to lower for matching
		const lowerText = text.toLowerCase();

		for (const token of tokenList) {
			const { symbol } = token;

			if (symbol && lowerText.includes(symbol.toLowerCase())) {
				found.push(symbol);

				if (found.length === 2) break;
			}
		}

		if (found.length === 2) {
			return {
				fromToken: found[0],
				toToken: found[1],
			};
		}

		return null;
	};
	useEffect(() => {
		if (content) {
			const tokens = extractTwoTokenNames(content);
			if (tokens?.fromToken) {
				setSellToken(tokens.fromToken);
			}
			if (tokens?.toToken) {
				setBuyToken(tokens.toToken);
			}
		}
	}, [content]);

	type TokenType = {
		address: string;
		symbol: string;
		decimals: number;
		// add other properties if needed
	};

	const [selectedSell, setSelectedSell] = useState<TokenType | null>(null);
	const [selectedBuy, setSelectedBuy] = useState<TokenType | null>(null);
	const [sellTokenPrice, setSellTokenPrice] = useState(0);
	const [buyTokenPrice, setBuyTokenPrice] = useState(0);
	const [inputError, setInputError] = useState("");
	const [txnHash, setTxnHash] = useState<string | null>(null);
	const [isSwapping, setIsSwapping] = useState(false);
	const {
		mutate: fetchQuote,
		data: quoteData,
		isSuccess: quoteSuccess,
	} = useGetQuotes();

	useEffect(() => {
		setPopupOpened(true);
	});
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

			tokenMutation(
				{
					tokenAddress: [initialSellToken.address, initialBuyToken.address],
					token: retriveToken || "",
				},
				{
					onSuccess: (data: any) => {
						setSellTokenPrice(data.data[initialSellToken.address]);
						setBuyTokenPrice(data.data[initialBuyToken.address]);
					},
				}
			);
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
						sellTokenId: selectedSell.address,
						buyTokenId: selectedBuy.address,
					},
					{
						onSuccess: (data) => {
							// Handle the quote data as needed
							setAmountOut(
								Number(data.data.assumedAmountOut) /
									10 ** Number(selectedBuy.decimals)
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
					sellTokenId: selectedSell.address,
					buyTokenId: selectedBuy.address,
				},
				{
					onSuccess: (data) => {
						setAmountOut(
							Number(data.data.assumedAmountOut) /
								10 ** Number(selectedBuy.decimals)
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
				sellTokenId: selectedSell.address,
				buyTokenId: selectedBuy.address,
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
	const formatAmount = (amount: number) => {
		if (amount < 0.0001) {
			return amount.toFixed(8); // very small numbers
		} else if (amount < 1) {
			return amount.toFixed(6); // small numbers
		} else if (amount < 1000) {
			return amount.toFixed(4); // medium numbers
		} else {
			return amount.toFixed(2); // large numbers
		}
	};
	return (
		<>
			{isLoading ? (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
					<div className="text-white">Loading...</div>
				</div>
			) : (
				<div className="p-2 w-auto">
					Select the tokens and enter the amount you want to swap.
				</div>
			)}
			{swapSuccess ? (
				<div className="z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<div className="bg-[#0e0f1a] rounded-2xl w-full max-w-sm p-6 shadow-xl relative text-white">
						{/* Close Button */}
						{/* <button
							onClick={onClose}
							className="absolute top-4 right-4 text-gray-400 hover:text-white"
						>
							<X />
						</button> */}

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

							{/* <button
								onClick={onClose}
								className="mt-4 w-full bg-green-700 hover:bg-green-600 py-2 rounded-md text-white"
							>
								Close
							</button> */}
						</div>
					</div>
				</div>
			) : (
				<>
					{!isLoading && (
						<div className="z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm w-auto rounded-xl">
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
													className="bg-transparent border-none outline-none text-white w-24 focus:outline-none"
													value={amountIn}
													onChange={handleAmountChange}
												/>
												<p className="text-gray-400 text-xs mt-1">
													{sellTokenPrice &&
														`$${(
															Number(sellTokenPrice) * Number(amountIn)
														).toFixed(2)}`}
												</p>
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
													setSellOpen,
													buyToken,
													tokenMutation,
													setSellTokenPrice
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
												{formatAmount(amountOut)}
												<p className="text-gray-400 text-xs mt-1">
													{buyTokenPrice &&
														`$${(
															Number(buyTokenPrice) * Number(amountOut)
														).toFixed(2)}`}
												</p>
											</span>
											{renderTokenDropdown(
												!isLoading && tokenData && tokenData.data,
												buyToken,
												setBuyToken,
												buyOpen,
												setSelectedBuy,
												setBuyOpen,
												sellToken,
												tokenMutation,
												setBuyTokenPrice
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
													"-" +
													Number(
														quoteData.data.priceImpact.toFixed(4) * 100
													).toFixed(2) +
													"%"
												) : (
													<div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>

										<div className="flex justify-between w-auto">
											<span>Max. received</span>
											<span> </span>
											<span>
												{quoteSuccess ? (
													`${(
														Number(quoteData.data.assumedAmountOut) /
														10 ** Number(selectedBuy?.decimals)
													).toFixed(8)} ${buyToken}`
												) : (
													<div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>

										{/* <div className="flex justify-between">
											<span>Swap Price </span>
											<span>
												{quoteSuccess ? (
													(
														Number(quoteData.data.swapPrice) /
														10 ** Number(selectedSell?.decimals)
													).toFixed(8)
												) : (
													<div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div> */}

										{/* <div className="flex justify-between">
											<span>Gas fee</span>
											<span>
												{quoteSuccess ? (
													quoteData.data.gasSpent
												) : (
													<div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div> */}

										<div className="flex justify-between">
											<span>Routing source</span>
											<span>
												{quoteSuccess ? (
													"SushiSwap API"
												) : (
													<div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
												)}
											</span>
										</div>
									</div>

									<button
										className={`mt-4 w-full bg-[#fcc300] text-black hover:bg-[#faa300] py-2 rounded-md border border-gray-600 flex items-center justify-center gap-2 ${
											quoteSuccess ? "cursor-pointer" : "cursor-not-allowed"
										} ${
											isSwapping
												? "cursor-not-allowed bg-gray-600 hover:bg-gray-600"
												: ""
										}`}
										onClick={handleSwap}
										disabled={isSwapping}
									>
										{isSwapping && (
											<svg
												className="animate-spin h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
												></path>
											</svg>
										)}
										{isSwapping ? "Swapping..." : "Place Swap"}
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
