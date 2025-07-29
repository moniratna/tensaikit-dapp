/* eslint-disable @typescript-eslint/no-explicit-any */

import { PopupController } from "../utils/PopupController";

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
		if (response.status === 401) {
			throw "Unauthorized";
		}
		if (response.status === 405) {
			const data = await response.json();
			const currentTime = new Date().getTime();

			// Calculate unblock time
			const unblockTime = new Date(currentTime + data.msBeforeNext);

			// Format it as HH:MM:SS AM/PM
			const formattedTime = unblockTime.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				// second: "2-digit",
				hour12: true,
			});
			PopupController.trigger({
				title: "Limit Reached!",
				description: `You’ve reached your daily chat limit. To continue accessing TensaiKit, you can either upgrade your subscription plan or wait until tomorrow at ${formattedTime} to resume chatting. For subscription upgrades or assistance, please reach out us at`,
				contactEmail: "contact@tensaikit.xyz",
				icon: "warning",
				onButtonClick: () => {
					window.open("https://google.com", "_blank");
				},
			});
			throw { data: data.msBeforeNext, message: "Limit Reached!" };
		}
		const res_data = await response.json();
		return { data: res_data };
	} catch (error: any) {
		console.error("Fetch thread list failed:", error);
		throw new Error(error);
	}
};

export default chatAgent;
