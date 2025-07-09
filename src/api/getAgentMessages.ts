/* eslint-disable @typescript-eslint/no-explicit-any */
const getAgentMessages = async (
	agentType: string,
	page: number,
	token: string
) => {
	try {
		const response = await fetch(
			`${
				import.meta.env.VITE_BACKEND_URL
			}/v1/api/get-agent-messages?type=${agentType}&page=${page}`,
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

		return { messages: data.data };
	} catch (error: any) {
		console.error("Error fetching getAgentMessages:", error);
		throw new Error(error.message || "Failed to fetch threads");
	}
};
export default getAgentMessages;
