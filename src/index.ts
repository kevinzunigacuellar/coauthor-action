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
          avatarUrl,
        }
      }
    }
  }
}`

async function run() {
	try {
		if (
			github.context.payload.action === "labeled" &&
			github.context.payload.pull_request
		) {
			core.debug("Starting");
			const token = core.getInput("token", { required: true });
			core.debug("Got token");
			const octokit = github.getOctokit(token);
			const pr = github.context.payload.pull_request.number;
			const owner = github.context.repo.owner;
			const repo = github.context.repo.repo;
			const author = github.context.payload.pull_request.user.login;

			const result = await octokit.graphql(query, {
				owner,
				repo,
				pr,
			});

			console.log(JSON.stringify(result, null, 2));
			console.log(author)
			
		}
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
