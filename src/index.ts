import * as core from "@actions/core";
import * as github from "@actions/github";

const query = `
query participants($owner: String!, $repo: String!, $pr: Int!, $first: Int = 100) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      author {
        login
      }
      participants(first: $first) {
        nodes {
          name,
          login,
          databaseId,
        }
      }
    }
  }
}`;

interface GH_Response {
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

function createCoauthorString(user: {
	login: string;
	id: number;
	name: string | null;
}) {
	return `Co-authored-by: ${user.name ?? user.login} <${user.id}+${
		user.login
	}@users.noreply.github.com>`;
}

async function run() {
	try {
		if (
			github.context.payload.action === "labeled" &&
			github.context.payload.pull_request
		) {
			const token = core.getInput("token", { required: true });
			const octokit = github.getOctokit(token);
			const pr = github.context.payload.pull_request.number;
			const owner = github.context.repo.owner;
			const repo = github.context.repo.repo;
			const author = github.context.payload.pull_request.user.login;

			const data: GH_Response = await octokit.graphql(query, {
				owner,
				repo,
				pr,
			});

			const participants = (
				data.repository.pullRequest.participants.nodes ?? []
			)
				.map(({ name, login, databaseId }) => ({
					name,
					login,
					id: databaseId,
				}))
				// remove the author from the list of participants
				.filter((p) => p.login !== author);

			if (participants.length === 0) {
				core.info("No participants found");
				return;
			}
			const coauthors = participants.map(createCoauthorString).join("\n");
			console.log(coauthors);
		}
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
