export interface GH_Response {
	repository: {
		pullRequest: {
			participants: {
				nodes: {
					name: string;
					login: string;
					databaseId: number;
				}[];
			};
		};
	};
}
