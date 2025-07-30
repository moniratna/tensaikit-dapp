/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { ChevronDown, Wallet, X } from "lucide-react";
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
import { useAuth } from "../contexts/AuthContext";
import useFetchBalance from "../hooks/useFetchBalance";
import useGasPrice from "../hooks/useGasPrice";

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
	toolMessage,
	isInView,
}: {
	onClose: () => void;
	messageId: number;
	setPopupOpened: (value: boolean) => void;
	toolMessage: any;
	isInView: boolean;
}) {
	const { allTokens, userBalance } = useAuth();
	const retriveToken = localStorage.getItem("authToken");
	const { data: tokenData, isLoading } = useFetchTokens(retriveToken);
	const { mutate: tokenMutation } = useFetchTokenPrice();
	const [sellToken, setSellToken] = useState<string>("");
	const [buyToken, setBuyToken] = useState<string>("");
	const [buyOpen, setBuyOpen] = useState(false);
	const [sellOpen, setSellOpen] = useState(false);
	const [amountIn, setAmountIn] = useState("1");
	const [amountOut, setAmountOut] = useState(0);

	const extractTwoTokenNames = (
		tokenIn: string,
		tokenOut: string,
		tokenData: any
	) => {
		const found = [];

		// Convert to lower for matching
		const lowerTextTokenIn = tokenIn.toLowerCase();
		const lowerTextTokenOut = tokenOut.toLowerCase();
		for (const token of tokenData) {
			const { address } = token;

			if (lowerTextTokenIn === address.toLowerCase()) {
				found.push(token);
			}
		}
		for (const token of tokenData) {
			const { address } = token;

			if (lowerTextTokenOut === address.toLowerCase()) {
				found.push(token);
			}
		}

		return found;
	};
	useEffect(() => {
		if (
			isInView &&
			toolMessage !== null &&
			Object.keys(toolMessage).length > 0 &&
			allTokens &&
			allTokens.length > 0
		) {
			const tokenData = extractTwoTokenNames(
				toolMessage.tokenIn,
				toolMessage.tokenOut,
				allTokens
			);

			if (tokenData.length > 0) {
				setSellToken(tokenData[0].symbol);
				setSelectedSell(tokenData[0]);
				setBuyToken(tokenData[1].symbol);
				setSelectedBuy(tokenData[1]);
			} else {
				setSellToken("USDT");
				setBuyToken("AUSD");
			}

			setAmountIn(toolMessage.amount);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, toolMessage]);

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
	const [sellTokenBalance, setSellTokenBalance] = useState<string>("0");
	const [buyTokenBalance, setBuyTokenBalance] = useState<string>("");
	const { mutate: tokenBalanceMutation } = useFetchBalance();
	const [networkFee, setNetworkFee] = useState<string | null>(null);
	const {
		mutate: fetchQuote,
		data: quoteData,
		isSuccess: quoteSuccess,
	} = useGetQuotes();

	useEffect(() => {
		setPopupOpened(true);
	});
	useEffect(() => {
		if (
			isInView &&
			allTokens &&
			allTokens.length > 0 &&
			toolMessage !== null &&
			Object.keys(toolMessage).length > 0
		) {
			const tokenInLower = toolMessage.tokenIn.trim().toLowerCase();

			const tokenOutLower = toolMessage.tokenOut.trim().toLowerCase();

			const initialSellToken = allTokens.find(
				(token: any) => token.address?.toLowerCase() === tokenInLower
			);

			const initialBuyToken = allTokens.find(
				(token: any) => token.address?.toLowerCase() === tokenOutLower
			);

			if (initialBuyToken !== undefined && initialSellToken !== undefined) {
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
				tokenBalanceMutation(
					{
						token: retriveToken,
						buyToken: initialBuyToken.symbol,
						sellToken: initialSellToken.symbol,
						chainId: 747474,
					},
					{
						onSuccess: (data: any) => {
							setSellTokenBalance(
								(
									Math.floor(data.data.sellTokenBalance * 10000) / 10000
								).toString()
							);
							setBuyTokenBalance(
								(
									Math.floor(data.data.buyTokenBalance * 10000) / 10000
								).toString()
							);
						},
					}
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInView, allTokens, toolMessage]);
	useEffect(() => {
		// implement debounce for fetching quote
		if (isInView && selectedSell && selectedBuy && Number(amountIn) !== 0) {
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
	}, [isInView, selectedBuy, amountIn, selectedSell]);

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
	}, [selectedSell, selectedBuy, amountIn]);

	useEffect(() => {
		if (!toolMessage) return;

		const interval = setInterval(() => {
			if (selectedSell && selectedBuy && toolMessage) {
				// const initialSellToken = allTokens.find(
				// 	(token: any) =>
				// 		token.address.toLowerCase() === toolMessage.tokenIn.toLowerCase()
				// );
				// const initialBuyToken = allTokens.find(
				// 	(token: any) =>
				// 		token.address.toLowerCase() === toolMessage.tokenOut.toLowerCase()
				// );
				tokenMutation(
					{
						tokenAddress: [selectedSell.address, selectedBuy.address],
						token: retriveToken || "",
					},
					{
						onSuccess: (data: any) => {
							setSellTokenPrice(data.data[selectedSell.address]);
							setBuyTokenPrice(data.data[selectedBuy.address]);
						},
					}
				);
			}
		}, 10000); // 30 seconds

		return () => clearInterval(interval); // Cleanup
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSell, selectedBuy, amountIn]);

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
				onError: (error: any) => {
					console.error("Error swapping tokens:", error);
					toast.error(error.response.data.error);
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
	useEffect(() => {
		if (selectedSell && selectedBuy) {
			tokenBalanceMutation(
				{
					token: retriveToken,
					buyToken: selectedBuy.symbol,
					sellToken: selectedSell.symbol,
					chainId: 747474,
				},
				{
					onSuccess: (data: any) => {
						setSellTokenBalance(
							(
								Math.floor(data.data.sellTokenBalance * 10000) / 10000
							).toString()
						);
						setBuyTokenBalance(
							(Math.floor(data.data.buyTokenBalance * 10000) / 10000).toString()
						);
					},
				}
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSell, selectedBuy]);
	const { data: gasData, refetch: gasRefetch } = useGasPrice();
	useEffect(() => {
		gasRefetch();
	}, [quoteSuccess]);
	useEffect(() => {
		if (quoteData && gasData) {
			const fee =
				(Number(quoteData.data.gasSpent) / 10 ** 9) *
				(Number(gasData?.gasPrice) + Number(gasData?.priorityFee));
			setNetworkFee(fee.toString());
		}
	}, [quoteData, gasData]);
	console.log(
		"check fee",
		(Number(77000) / 10 ** 12) *
			(Number(gasData?.gasPrice) + Number(gasData?.priorityFee))
	);

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
									href={`${import.meta.env.VITE_KATANA_EXPLORER_URL}${txnHash}`}
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
											<div className="flex flex-col">
												{renderTokenDropdown(
													!isLoading &&
														tokenData &&
														tokenData.data.filter(
															(token: any) => token.symbol !== "uSUI"
														),
													sellToken,
													setSellToken,
													sellOpen,
													setSelectedSell,
													setSellOpen,
													buyToken,
													tokenMutation,
													setSellTokenPrice
												)}
												<div className="p-1 flex flex-row items-center gap-2">
													<div>
														<Wallet color="gray" size={20} />
													</div>
													<div>
														{(
															Math.floor(Number(sellTokenBalance) * 100) / 100
														).toFixed(2)}
													</div>
												</div>
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
											<div className="flex flex-col">
												{renderTokenDropdown(
													!isLoading &&
														tokenData &&
														tokenData.data.filter(
															(token: any) => token.symbol !== "uSUI"
														),
													buyToken,
													setBuyToken,
													buyOpen,
													setSelectedBuy,
													setBuyOpen,
													sellToken,
													tokenMutation,
													setBuyTokenPrice
												)}
												<div className="p-1 flex flex-row items-center gap-2">
													<div>
														<Wallet color="gray" size={20} />
													</div>
													<div>
														{(
															Math.floor(Number(buyTokenBalance) * 100) / 100
														).toFixed(2)}
													</div>
												</div>
											</div>
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
										<div className="flex justify-between w-auto">
											<span>Network fee</span>
											<span> </span>
											<span>
												{quoteSuccess ? (
													`${Number(networkFee).toFixed(10)} ETH`
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
											isSwapping ||
											Number(amountIn) > Number(sellTokenBalance) ||
											Number(networkFee) > Number(userBalance)
												? "cursor-not-allowed bg-gray-600 hover:bg-gray-600"
												: ""
										}`}
										onClick={handleSwap}
										disabled={
											isSwapping ||
											Number(amountIn) > Number(sellTokenBalance) ||
											Number(networkFee) > Number(userBalance)
										}
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
									<div className="text-xs text-red-600">
										{Number(amountIn) > Number(sellTokenBalance)
											? "Insufficient balance for swap."
											: Number(networkFee) > Number(userBalance)
											? "Insufficient eth to pay gas fees."
											: null}
									</div>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
