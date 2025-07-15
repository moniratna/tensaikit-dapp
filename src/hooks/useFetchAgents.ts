/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useFetchAgents = (token: string | null | undefined) => {
	return useQuery({
		queryKey: ["agents"],
		queryFn: () => getAgentList(token),
		// staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
};

const getAgentList = async (token: string | null | undefined) => {
	try {
		const retriveToken = localStorage.getItem("authToken");
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/explore-agents`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token ? token : retriveToken}`,
				},
				body: null,
			}
		);
		if (response.status === 401) {
			throw "Unauthorized";
		}
		const res_data = await response.json();
		return { agents: res_data.data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};

export default useFetchAgents;
