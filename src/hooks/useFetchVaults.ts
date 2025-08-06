/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchVaults = (token: string | null | undefined) => {
	return useQuery({
		queryKey: ["markets"],
		queryFn: () => getVaults(token),
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
};

const getVaults = async (token: string | null | undefined) => {
	try {
		const retriveToken = localStorage.getItem("authToken");
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-morpho-vaults`,
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

export default useFetchVaults;
