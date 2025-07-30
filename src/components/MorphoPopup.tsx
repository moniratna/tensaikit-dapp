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
import useFetchMarkets from "../hooks/useFetchMarkets";
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
	const [visibleVaults, setVisibleVaults] = useState([]);

	const retriveToken = localStorage.getItem("authToken");

	const { data: markets, isLoading } = useFetchMarkets(retriveToken);
	useEffect(() => {
		if (markets) {
			const filteredMarkets =
				!isLoading &&
				markets?.data.data.items.filter(
					(market: any) => market.collateralAsset !== null
				);

			const visibleVaults =
				!isLoading && filteredMarkets.length > 0 && showAll
					? filteredMarkets
					: filteredMarkets.slice(0, 5);
			setVisibleVaults(visibleVaults);
		}
	}, [markets, showAll]);

	type TokenType = {
		id: string;
		symbol: string;
		icon: string;
		// add other properties if needed
	};

	const [selectedSell, setSelectedSell] = useState<TokenType | null>(null);
	const [selectedBuy, setSelectedBuy] = useState<TokenType | null>(null);

	return (
		<>
			<div className="p-2">
				Please let me know how would you like to proceed
			</div>
			<div className="bg-[#1c1c1c] text-white max-w-6xl mx-auto p-4 rounded-lg shadow-md">
				{/* Header */}
				<div className="flex items-center justify-between pb-4 border-b border-gray-700">
					<div className="flex items-center gap-2">
						<img
							src="https://pbs.twimg.com/profile_images/1930600293915410432/dgTU7UNU_400x400.jpg"
							alt="Morpho"
							className="w-6 h-6"
						/>
						<h2 className="text-xl font-semibold">Morpho</h2>
					</div>
					<button className="bg-[#2c2c2c] px-3 py-1 rounded-full text-sm">
						Katana
					</button>
				</div>

				{/* Table Header */}
				<div className="grid grid-cols-5 text-sm text-gray-400 py-3 border-b border-gray-700 mt-2">
					<div className="col-span-2">Collateral</div>
					<div>Loan</div>
					<div>LLTV</div>

					<div></div>
				</div>

				{/* Vault Rows */}
				{visibleVaults.map((market: any, idx: any) => (
					<div
						key={idx}
						className="grid grid-cols-5 items-center py-4 border-b border-gray-700 text-sm"
					>
						{/* Vault Info */}
						<div className="col-span-2 flex items-center gap-2">
							{/* <img src={vault.icon} alt={vault.name} className="w-5 h-5" /> */}
							<span>{market.collateralAsset.symbol}</span>
						</div>
						<div>
							{/* <img src={vault.icon} alt={vault.name} className="w-5 h-5" /> */}
							<span>{market.loanAsset.symbol}</span>
						</div>
						<div>
							{/* <img src={vault.icon} alt={vault.name} className="w-5 h-5" /> */}
							<span>{(Number(market.lltv) / 10 ** 16).toFixed(2)}%</span>
						</div>

						{/* Supply */}
						{/* <div>
						<div>{market.supply}</div>
						<div className="text-gray-400">{vault.supplyShort}</div>
					</div> */}

						{/* APY */}
						{/* <div className="text-green-400 font-medium">{vault.apy}</div> */}

						{/* Curator */}
						{/* <div className="flex items-center gap-2">
						<img
							src={vault.curatorIcon}
							alt={vault.curator}
							className="w-4 h-4"
						/>
						<span className="truncate">{vault.curator}</span>
					</div> */}

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
		</>
	);
}
