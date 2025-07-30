/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGasPrice = () => {
	return useQuery({
		queryKey: ["gas-price"],
		queryFn: () => getGasPrice(),
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
};

const getGasPrice = async () => {
	try {
		const retriveToken = localStorage.getItem("authToken");
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-gas-data`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${retriveToken}`,
				},
			}
		);
		const res_data = response.data;
		// const priorityRes = priorityData.data;
		console.log(
			"gas gas",
			res_data.gasData.gas_prices.fast,
			res_data.priorityData.fast.maxPriorityFee
		);
		return {
			gasPrice: res_data.gasData.gas_prices.fast,
			priorityFee: res_data.priorityData.fast.maxPriorityFee,
		};
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};

export default useGasPrice;
