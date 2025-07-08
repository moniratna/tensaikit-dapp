/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type deleteThreadVariables = {
	token?: string | null;
	threadId: string;
};

const useDeleteThread = () => {
	return useMutation<{ data: any }, Error, deleteThreadVariables>({
		mutationFn: async ({ token, threadId }: deleteThreadVariables) => {
			return deleteThread(token, threadId);
		},
	});
};

const deleteThread = async (
	token: string | null | undefined,
	threadId: string
) => {
	try {
		const retriveToken = localStorage.getItem("authToken");
		const response = await axios.post(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/delete-thread?id=${threadId}`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token ? token : retriveToken}`,
				},
			}
		);
		const res_data = response.data;
		return { data: res_data.data };
	} catch (error: any) {
		console.error("delete thread list failed:", error);
		throw error;
	}
};

export default useDeleteThread;
