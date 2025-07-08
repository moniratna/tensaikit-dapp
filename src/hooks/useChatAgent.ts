/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import chatAgent from "../api/chatAgent";

const useChatAgent = () => {
	return useMutation({
		mutationFn: async ({ token, prompt, threadId, agentType }: any) => {
			return chatAgent(token, prompt, threadId, agentType);
		},
	});
};
export default useChatAgent;
