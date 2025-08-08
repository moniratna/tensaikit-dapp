import { X } from "lucide-react";
import React, { useState } from "react";
import useMorphoDeposit from "../hooks/useMorphoDeposit";

export default function DepositPopup({
	setShowPopup,
	marketId,
	token,
	imageUrl,
	balance,
	apy,
}: {
	setShowPopup: (show: boolean) => void;
	marketId: string | null | undefined;
	token: string;
	imageUrl: string;
	balance: string;
	apy: string;
}) {
	console.log("checking balance", balance);

	const [amountIn, setAmountIn] = useState("");
	const [inputError, setInputError] = useState("");
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
	const { mutate: depositMutation } = useMorphoDeposit();
	const handleDeposit = () => {
		if (amountIn === "") {
			setInputError("Please enter an amount");
			return;
		}
		const amount = parseFloat(amountIn);
		if (isNaN(amount) || amount <= 0) {
			setInputError("Invalid amount");
			return;
		}
		depositMutation(
			{
				token: localStorage.getItem("authToken") || "",
				marketId: marketId,
				amount: amount,
			},
			{
				onSuccess: () => {
					setShowPopup(false);
				},
				onError: (error) => {
					setInputError(error.message);
				},
			}
		);
	};
	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
			<div className="bg-gray-900 rounded-2xl p-6 w-[400px]">
				<div className="flex flex-row justify-end">
					<div
						className="text-gray-300 text-sm mb-2"
						onClick={() => setShowPopup(false)}
					>
						<X />
					</div>
					{/* <div className="text-gray-300 text-sm mb-2">Close</div> */}
				</div>
				{/* Deposit Box */}
				<div className="bg-gray-800 rounded-xl p-5 mb-6 relative">
					<div className="text-gray-300 text-sm mb-2">Deposit {token}</div>
					<div className="flex items-center">
						<div className="absolute right-5 top-5 flex items-center gap-2">
							<div className="bg-gray-700 p-2 rounded-full">
								{/* Token Icon Placeholder */}
								<img src={imageUrl} alt={token} className="w-6 h-6" />
							</div>
						</div>
					</div>
					<input
						type="text"
						className="bg-transparent border-none outline-none text-white w-24 focus:outline-none"
						value={amountIn}
						onChange={handleAmountChange}
						placeholder="0.00"
					/>
					{inputError && (
						<p className="text-red-400 text-xs mt-1">{inputError}</p>
					)}

					<div className="flex justify-between items-center mt-3">
						<div className="text-gray-400 text-sm">{balance} vbUSDC</div>
						<button
							className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-md"
							onClick={() => setAmountIn(balance)}
						>
							MAX
						</button>
					</div>
				</div>

				{/* Earnings Info */}
				<div className="bg-gray-800 rounded-xl p-5">
					{/* <div className="flex items-center text-gray-300 mb-4">
						<span
							role="img"
							aria-label="deposit"
							className="mr-2 text-blue-400"
						>
							💲
						</span>
						<span>Deposit {token}</span>
						<span className="ml-auto">0.00</span>
					</div> */}
					<div className="flex justify-between text-gray-400 text-sm mb-2">
						<span>APY</span>
						<span>{(Number(apy) * 100).toFixed(2)}%</span>
					</div>
					{/* <div className="flex justify-between text-gray-400 text-sm mb-2">
						<span>Monthly earnings</span>
						<span>$0.00</span>
					</div>
					<div className="flex justify-between text-gray-400 text-sm">
						<span>Yearly earnings</span>
						<span>$0.00</span>
					</div> */}
				</div>

				{/* Input Placeholder */}
				<div className="mt-6 rounded-xl py-3 text-center text-gray-500">
					<button
						className={`${
							amountIn !== "" ? "bg-[#fcc300]" : "bg-gray-600"
						} p-3 rounded-xl text-center text-black`}
						onClick={handleDeposit}
					>
						{amountIn === "" ? "Enter an amount" : `Deposit ${token}`}
					</button>
				</div>
			</div>
		</div>
	);
}
