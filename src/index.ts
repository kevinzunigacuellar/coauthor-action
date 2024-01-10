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
			// github.context.payload.label.name === "bug" &&
			github.context.payload.pull_request
		) {
			
			const token = core.getInput("gh-token");
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

			console.log(result);
			console.log(author);
		}
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
