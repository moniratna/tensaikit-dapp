/* eslint-disable @typescript-eslint/no-explicit-any */

const chatAgent = async (
	token: string | null | undefined,
	prompt: string,
	threadId?: number | undefined,
	agentType?: string
) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/agent`,
			{
				method: "POST",
				body: JSON.stringify({
					prompt: prompt,
					threadId: threadId,
					type: agentType,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken") || token}`,
				},
			}
		);
		const res_data = await response.json();
		return { data: res_data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw error;
	}
};

export default chatAgent;
