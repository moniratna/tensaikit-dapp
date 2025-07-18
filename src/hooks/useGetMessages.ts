import { useInfiniteQuery } from "@tanstack/react-query";
import getMessages from "../api/getMessages";

const useChatMessages = (id: number, token: string, enableFlag: boolean) => {
	return useInfiniteQuery({
		queryKey: ["chats", id],
		queryFn: (ctx) => getMessages(id, ctx.pageParam, token),
		getNextPageParam: (lastPage, allpages) => {
			console.log("lastPage", lastPage, allpages);
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
		refetchOnWindowFocus: false,
	});
};
export default useChatMessages;
