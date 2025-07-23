/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type GetBalanceVariables = {
	token?: string | null;
	asset: string | null;
	chainId: number;
};

const useFetchBalance = () => {
	return useMutation<{ data: any }, Error, GetBalanceVariables>({
		mutationFn: async ({ token, asset, chainId }: GetBalanceVariables) => {
			return fetchBalance(token, asset, chainId);
		},
	});
};

const fetchBalance = async (
	token: string | null | undefined,
	asset: string | null,
	chainId: number
) => {
	// try {
	const retriveToken = localStorage.getItem("authToken");
	const response = await axios.post(
		`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-wallet-balance`,
		{
			asset: asset,
			chainId: chainId,
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

export default useFetchBalance;
