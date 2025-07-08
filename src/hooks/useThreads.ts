import { useInfiniteQuery } from "@tanstack/react-query";
import getThreads from "../api/getThreads";

const useThreads = (token: string, enableFlag: boolean) => {
	return useInfiniteQuery({
		queryKey: ["threads"],
		queryFn: (ctx) => getThreads(ctx.pageParam, token),
		getNextPageParam: (lastPage, allpages) => {
			// If the API returns an empty array, stop pagination
			return lastPage && lastPage.threads.length > 0
				? allpages.length + 1
				: undefined;
		},
		initialPageParam: 1,
		// staleTime: Infinity,
		enabled: enableFlag,
		refetchOnWindowFocus: false,
	});
};
export default useThreads;
