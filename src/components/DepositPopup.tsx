import { X } from "lucide-react";
import React, { useState } from "react";

export default function DepositPopup({
	setShowPopup,
	token,
	imageUrl,
	balance,
	apy,
	onDepositClick,
}: {
	setShowPopup: (show: boolean) => void;
	token: string;
	imageUrl: string;
	balance: string;
	apy: string;
	onDepositClick: () => void;
}) {
	console.log("checking balance", balance);
	const [amount, setAmount] = useState("");
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
					<div className="text-gray-300 text-sm mb-2">Deposit vbUSDC</div>
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
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="0.00"
					/>

					<div className="flex justify-between items-center mt-3">
						<div className="text-gray-400 text-sm">{balance} vbUSDC</div>
						<button className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-md">
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
				<div className="mt-6 bg-gray-800 rounded-xl py-3 text-center text-gray-500">
					Enter an amount
				</div>
			</div>
		</div>
	);
}
