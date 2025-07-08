import Navbar from "./Navbar";
import MainPage from "../pages/MainPage";

export default function AppLayout() {
	return (
		<div className="h-screen w-full overflow-hidden">
			{/* Fixed Navbar */}
			<Navbar />

			{/* Below section scrolls under fixed navbar */}
			<div className="flex h-full pt-10">
				{/* Sidebar */}
				{/* <div className="w-64 h-full overflow-y-auto bg-[#1B012F] border-r border-gray-800">
					<Sidebar />
				</div> */}

				{/* Main content */}
				<div className="flex-1 h-full overflow-y-auto bg-[#110020] p-4">
					<MainPage />
				</div>
			</div>
		</div>
	);
}
