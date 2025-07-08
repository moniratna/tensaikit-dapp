/* eslint-disable @typescript-eslint/no-explicit-any */
const getMessages = async (threadId: number, page: number, token: string) => {
	try {
		console.log("Page, Token:", page, token);
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
		const data = await response.json();
		console.log("Fetched threads:", data);
		return { messages: data.data };
	} catch (error: any) {
		console.error("Error fetching threads:", error);
		throw new Error(error.message || "Failed to fetch threads");
	}
};
export default getMessages;
