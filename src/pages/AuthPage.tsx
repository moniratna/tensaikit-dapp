/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import iconYellow from "../assets/iconYellow.png";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage: React.FC = () => {
	const { user, login, signup, loginWithGoogle, loading, isLogin, setIsLogin } =
		useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
	});
	const [error, setError] = useState("");

	if (user) {
		return <Navigate to="/" replace />;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			if (isLogin) {
				await login(formData.email, formData.password);
			} else {
				await signup(
					formData.email,
					formData.password,
					formData.firstName,
					formData.lastName
				);
			}
		} catch (err: any) {
			console.log("checkign error", err);
			setError(err.message);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#1B012F] via-[#1B012F] to-indigo-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto h-16 w-16  rounded-2xl flex items-center justify-center shadow-lg">
						{/* <MessageSquare className="h-8 w-8 text-white" /> */}
						<img src={iconYellow} alt="AgentKit Logo" className="h-16 w-16" />
					</div>
					<h2 className="mt-6 text-3xl font-bold text-white">
						{isLogin ? "Welcome back" : "Create your account"}
					</h2>
					<p className="mt-2 text-sm text-gray-300">
						{isLogin
							? "Sign in to your account"
							: "Start your AI conversation journey"}
					</p>
				</div>

				<div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
					{/* {error && (
						<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)} */}

					<button
						// onClick={handleGoogleLogin}
						disabled={loading}
						className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
					>
						{/* <Chrome className="h-5 w-5 mr-2" />
						Continue with Google */}
						<GoogleLogin
							onSuccess={(credentialResponse) => {
								if (credentialResponse.credential) {
									loginWithGoogle(credentialResponse.credential);
								} else {
									setError(
										"Google authentication failed. No credential received."
									);
								}
							}}
							onError={() => {
								console.log("Login Failed");
							}}
						/>
					</button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								Or continue with email
							</span>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{!isLogin && (
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									First Name
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										id="firstName"
										type="text"
										required={!isLogin}
										value={formData.firstName}
										onChange={(e) =>
											setFormData({ ...formData, firstName: e.target.value })
										}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Enter your full name"
									/>
								</div>
							</div>
						)}
						{!isLogin && (
							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Last Name
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										id="name"
										type="text"
										required={!isLogin}
										value={formData.lastName}
										onChange={(e) =>
											setFormData({ ...formData, lastName: e.target.value })
										}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Enter your full name"
									/>
								</div>
							</div>
						)}

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="email"
									type="email"
									required
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter your email"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="password"
									type="password"
									required
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter your password"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#ffc300] to-[#fbb300] hover:from-[#fbb300] hover:to-[#ffc300] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{loading ? (
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
							) : isLogin ? (
								"Sign In"
							) : (
								"Create Account"
							)}
						</button>
					</form>

					<div className="text-center">
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="text-sm text-blue-600 hover:text-blue-500 font-medium"
						>
							{isLogin
								? "Don't have an account? Sign up"
								: "Already have an account? Sign in"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
