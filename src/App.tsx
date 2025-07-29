/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppLayout from "./components/AppLayout";
import { PopupProvider } from "./contexts/PopupContext";

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error: any) => {
			if (error.message === "Unauthorized") {
				toast.error("Session expired. Please log in again.");
				localStorage.removeItem("authToken");
				window.location.href = "/auth"; // Or use router.navigate('/auth')
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: (error: any) => {
			if (error.message === "Unauthorized") {
				toast.error("Session expired. Please log in again.");
				localStorage.removeItem("authToken");
				window.location.href = "/auth"; // Or use router.navigate('/auth')
			}
		},
	}),
});
function App() {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<QueryClientProvider client={queryClient}>
				<PopupProvider>
					<Toaster richColors />
					<AuthProvider>
						<Router>
							<Routes>
								<Route path="/auth" element={<AuthPage />} />
								<Route
									path="/"
									element={
										<ProtectedRoute>
											{/* <Navbar />
										<MainPage /> */}
											<AppLayout />
										</ProtectedRoute>
									}
								/>
							</Routes>
						</Router>
					</AuthProvider>
				</PopupProvider>
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}

export default App;
