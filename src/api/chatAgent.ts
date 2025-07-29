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
				description: `You have exceeded your daily chat limit.You can upgrade your plan or You can again chat with tensaikit after tomorrow ${formattedTime}. Contact us for subscribtion.`,
				buttonText: "Contact us",
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
