/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type GetQuotesVariables = {
	token?: string | null;
	sellTokenId: string;
	buyTokenId: string;
	amountIn: number;
	messageId: number;
};

const useSwapToken = () => {
	return useMutation<{ data: any }, Error, GetQuotesVariables>({
		mutationFn: async ({
			token,
			sellTokenId,
			buyTokenId,
			amountIn,
			messageId,
		}: GetQuotesVariables) => {
			return swapExecute(token, sellTokenId, buyTokenId, amountIn, messageId);
		},
	});
};

const swapExecute = async (
	token: string | null | undefined,
	tokenIn: string,
	tokenOut: string,
	amount: number,
	messageId: number
) => {
	// try {
	const retriveToken = localStorage.getItem("authToken");
	const response = await axios.post(
		`${import.meta.env.VITE_BACKEND_URL}/v1/api/execute-swap`,
		{
			tokenIn: tokenIn,
			tokenOut: tokenOut,
			amount: amount,
			messageId: messageId,
		},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token ? token : retriveToken}`,
			},
		}
	);
	if (response.status === 401) {
		throw new Error("Unauthorized");
	}
	if (response.status !== 200) {
		console.log("error", response);
		throw new Error(response.data.error); // ❗ must throw
	}
	const res_data = response.data;
	return { data: res_data.data };
	// } catch (error: any) {
	// 	console.error("Fetch thread list failed:", error.message);
	// 	throw new Error(error.message);
	// }
};

export default useSwapToken;
