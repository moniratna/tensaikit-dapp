/* eslint-disable @typescript-eslint/no-explicit-any */
const getThreads = async (page: number, token: string) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_BACKEND_URL}/v1/api/get-threads?page=${page}`,
			{
				method: "POST",
				body: null,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("authToken") || token}`,
				},
			}
		);
		if (response.status === 401) {
			throw "Unauthorized";
		}
		const data = await response.json();
		return { threads: data.data };
	} catch (error: any) {
		console.log(error);
		console.error("Error fetching threads:", error);
		throw new Error(error);
	}
};
export default getThreads;
