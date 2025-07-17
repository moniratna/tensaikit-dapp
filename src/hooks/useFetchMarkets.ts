/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchMarkets = (token: string | null | undefined) => {
	return useQuery({
		queryKey: ["markets"],
		queryFn: () => getMarkets(token),
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
};

const getMarkets = async (token: string | null | undefined) => {
	try {
		const retriveToken = localStorage.getItem("authToken");
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-morpho-markets`,
			{},
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

export default useFetchMarkets;
