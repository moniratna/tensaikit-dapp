import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();
function App() {
	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<QueryClientProvider client={queryClient}>
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
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}

export default App;
