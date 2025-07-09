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
			return lastPage && lastPage.messages.length > 0
				? allpages.length + 1
				: undefined;
		},
		initialPageParam: 1,
		// staleTime: Infinity,
		enabled: enableFlag,
		refetchOnWindowFocus: false,
	});
};
export default useGEtAgentMessages;
