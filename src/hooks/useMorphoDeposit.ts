/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type GetQuotesVariables = {
	token?: string | null;
	marketId: string | null | undefined;
	amount: number;
};

const useMorphoDeposit = () => {
	return useMutation<{ data: any }, Error, GetQuotesVariables>({
		mutationFn: async ({ token, marketId, amount }: GetQuotesVariables) => {
			return executeDeposit(token, marketId, amount);
		},
	});
};

const executeDeposit = async (
	token: string | null | undefined,
	marketId: string | null | undefined,
	amount: number
) => {
	// try {
	const retriveToken = localStorage.getItem("authToken");
	const response = await axios.post(
		`${import.meta.env.VITE_BACKEND_URL}/v1/api/supply-to-morpho`,
		{
			marketId: marketId,
			amount: amount,
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
		throw new Error(response.data.error); // ❗ must throw
	}
	const res_data = response.data;
	return { data: res_data.data };
	// } catch (error: any) {
	// 	console.error("Fetch thread list failed:", error.message);
	// 	throw new Error(error.message);
	// }
};

export default useMorphoDeposit;
