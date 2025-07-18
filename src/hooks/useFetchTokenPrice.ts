/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useFetchTokenPrice = () => {
	return useMutation({
		mutationKey: ["token-price"],
		mutationFn: ({
			tokenAddress,
			token,
		}: {
			tokenAddress: string[];
			token: string;
		}) => getTokenPrice(tokenAddress, token),
	});
};

const getTokenPrice = async (
	tokenAddress: string[],
	token: string | null | undefined
) => {
	try {
		const retriveToken = localStorage.getItem("authToken");
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-token-price`,
			{ tokenAddress: tokenAddress },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token ? token : retriveToken}`,
				},
			}
		);
		if (response.status === 401) {
			throw "Unauthorized";
		}
		const res_data = response.data;
		return { data: res_data.data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};

export default useFetchTokenPrice;
