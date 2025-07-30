/* eslint-disable @typescript-eslint/no-explicit-any */
const getMessages = async (threadId: number, page: number, token: string) => {
	try {
		const response = await fetch(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/v1/api/get-messages?id=${threadId}&page=${page}`,
			{
				method: "POST",
				body: null,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken") || token}`,
				},
			}
		);
		if (response.status === 401) {
			throw "Unauthorized";
		}
		const data = await response.json();
		return { messages: data.data };
	} catch (error: any) {
		console.log("error error", error);
		console.error("Error fetching threads:", error);
		throw new Error(error || "Failed to fetch threads");
	}
};
export default getMessages;
