/* eslint-disable @typescript-eslint/no-explicit-any */
const getThreads = async (page: number, token: string) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-threads?page=${page}`,
			{
				method: "POST",
				body: null,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken") || token}`,
				},
			}
		);
		const data = await response.json();
		return { threads: data.data };
	} catch (error: any) {
		console.error("Error fetching threads:", error);
		throw new Error(error.message || "Failed to fetch threads");
	}
};
export default getThreads;
