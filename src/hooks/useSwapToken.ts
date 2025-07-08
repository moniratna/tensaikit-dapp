/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type GetQuotesVariables = {
	token?: string | null;
	sellTokenId: string;
	buyTokenId: string;
	amountIn: number;
};

const useSwapToken = () => {
	return useMutation<{ data: any }, Error, GetQuotesVariables>({
		mutationFn: async ({
			token,
			sellTokenId,
			buyTokenId,
			amountIn,
		}: GetQuotesVariables) => {
			return swapExecute(token, sellTokenId, buyTokenId, amountIn);
		},
	});
};

const swapExecute = async (
	token: string | null | undefined,
	tokenIn: string,
	tokenOut: string,
	amount: number
) => {
	try {
		console.log("am i getting called with");
		const retriveToken = localStorage.getItem("authToken");
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/execute-swap`,
			{
				tokenIn: tokenIn,
				tokenOut: tokenOut,
				amount: amount,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token ? token : retriveToken}`,
				},
			}
		);
		console.log("Quote response:", response.data);
		const res_data = response.data;
		return { data: res_data.data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw error;
	}
};

export default useSwapToken;
