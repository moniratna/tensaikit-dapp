import { Fragment, useEffect, useState } from "react";
import { Menu, Copy, LogOut, User } from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import logoWordMark from "../assets/logoWordMark.png";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import katana from "../assets/katana.webp";
import useFetchBalance from "../hooks/useFetchBalance";

const Navbar = () => {
	const { user, logout, setIsOpenSidebar, isOpenSidebar } = useAuth();
	const [balance, setBalance] = useState(0);
	const { mutate } = useFetchBalance();
	const copyToClipboard = (content: string) => {
		navigator.clipboard.writeText(content);
	};
	useEffect(() => {
		mutate(
			{
				token: localStorage.getItem("authToken"),
				asset: null,
				chainId: 747474,
			},
			{
				onSuccess: (data) => {
					setBalance(Number(data.data.nativeBalance));
				},
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-[#1B012F] text-white shadow-md px-4 py-3 flex items-center justify-between">
			{/* Left: Logo & Sidebar Toggle */}
			<div className="flex items-center space-x-3">
				<button
					className="p-2 rounded focus:outline-none focus:ring-0 hover:bg-gray-700"
					onClick={() => {
						// Implement your sidebar toggle logic here
						setIsOpenSidebar(!isOpenSidebar);
					}}
				>
					<Menu className="w-5 h-5" />
				</button>
				<img src={logoWordMark} alt="Logo" className="h-7" />
			</div>

			{/* Right: Wallet address + user dropdown */}
			<div className="flex items-center space-x-4">
				{/* Wallet Address */}
				<div
					className="text-xs text-gray-400 flex items-center space-x-1 cursor-pointer"
					onClick={() => {
						if (user?.walletAddress) {
							navigator.clipboard.writeText(user.walletAddress);
							toast("Wallet address copied to clipboard");
						}
					}}
					title={user?.walletAddress}
				>
					<Copy className="h-4 w-4" />
					<p>
						{user?.walletAddress &&
							`${user.walletAddress.slice(0, 5)}...${user.walletAddress.slice(
								-4
							)}`}
					</p>
				</div>
				<div className="text-xs text-gray-400 flex items-center space-x-1 cursor-pointer">
					{`Balance: ${balance.toFixed(2)}`}
				</div>
				<div className="text-xs text-gray-400 flex items-center space-x-1 cursor-pointer">
					<img src={katana} className="h-5 w-5 rounded-lg" />
				</div>

				{/* Dropdown */}
				<HeadlessMenu as="div" className="relative">
					<HeadlessMenu.Button className="w-8 h-8 bg-[#ffc300] text-black rounded-full flex items-center justify-center hover:opacity-90 transition focus:outline-none focus:ring-0">
						<User className="h-4 w-4" />
					</HeadlessMenu.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white text-black divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
							<div className="px-4 py-3 text-sm">
								<p className="font-medium truncate">{user?.name || "User"}</p>
								<p
									className="text-gray-500 truncate"
									title={user?.email.toLowerCase()}
									onClick={() =>
										copyToClipboard(user?.email.toLowerCase() || "")
									}
								>
									{user?.email.toLowerCase()}
								</p>
							</div>
							<div className="p-1">
								<HeadlessMenu.Item>
									{({ active }) => (
										<button
											onClick={logout}
											className={`${
												active ? "bg-gray-100" : ""
											} flex items-center w-full px-4 py-2 text-sm text-left`}
										>
											<LogOut className="h-4 w-4 mr-2" />
											Logout
										</button>
									)}
								</HeadlessMenu.Item>
							</div>
						</HeadlessMenu.Items>
					</Transition>
				</HeadlessMenu>
			</div>
		</header>
	);
};

export default Navbar;
