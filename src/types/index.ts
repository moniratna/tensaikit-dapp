/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
	id: string;
	email: string;
	name: string;
	walletAddress: string;
	avatar?: string;
}

export interface Message {
	id: string;
	content: string;
	sender: "user" | "agent";
	createdAt: Date;
	type: string;
	threadId: number;
	txnHash?: string;
	userPrompt?: string;
	toolMessage?: any;
}

export interface ChatThread {
	id: string;
	title: string;
	messages: Message[];
	createdAt: Date;
	updatedAt: Date;
	type?: string;
}

export interface Protocol {
	id: string;
	name: string;
	description: string;
	logo: string;
	tvl: string;
	apy: string;
}

export interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	signup: (
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) => Promise<void>;
	loginWithGoogle: (threadId: string) => Promise<void>;
	logout: () => void;
	loading: boolean;
	activeChatId: string | null;
	setActiveChatId: (id: string | null) => void;
	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;
	isOpenSidebar: boolean;
	setIsOpenSidebar: (isOpen: boolean) => void;
	agentType: string;
	setAgentType: (type: string) => void;
	allChats: Message[];
	setAllChats: React.Dispatch<React.SetStateAction<Message[]>>;
	selectedAgent: string;
	setSelectedAgent: (agent: string) => void;
	successSignup: boolean;
	isLogin: boolean;
	setIsLogin: (isLogin: boolean) => void;
	allTokens: any[];
	setAllTokens: (tokens: any[]) => void;
}
