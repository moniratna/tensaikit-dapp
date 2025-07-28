import { useInfiniteQuery } from "@tanstack/react-query";
import getAgentMessages from "../api/getAgentMessages";

const useGEtAgentMessages = (
	agentType: string,
	token: string,
	enableFlag: boolean
) => {
	return useInfiniteQuery({
		queryKey: ["agent-messages", agentType],
		queryFn: (ctx) => getAgentMessages(agentType, ctx.pageParam, token),
		getNextPageParam: (lastPage, allpages) => {
			// If the API returns an empty array, stop pagination
			if (lastPage.messages.length === 0) {
				return undefined;
			}
			// If the API returns an empty array, stop pagination
			return lastPage &&
				lastPage.messages.length > 0 &&
				lastPage.messages.length < 10
				? undefined
				: allpages.length + 1;
		},
		initialPageParam: 1,
		// staleTime: Infinity,
		enabled: enableFlag,
	});
};
export default useGEtAgentMessages;
