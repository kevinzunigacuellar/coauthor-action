import * as core from "@actions/core";
import * as github from "@actions/github";
import { query } from "./constants.js";
import type { GH_Response } from "./types.js";
import { createCoauthorString } from "./utils.js";

async function run() {
	// Check if the comment contains the trigger word
	if (github.context.payload.comment?.body !== "!coauthors") {
		core.notice("Skipping, comment does not contain '!coauthors'");
		return;
	}

	// Get context data
	const token = core.getInput("token", { required: true });
	const octokit = github.getOctokit(token);
	const pr = github.context.payload.issue?.number;
	const author = github.context.payload.comment?.user.login;
	const { owner, repo } = github.context.repo;

	// Check for required context data
	if (!pr || !author || !owner || !repo) {
		core.setFailed("Could not get pull request number, author, owner or repo");
		return;
	}

	try {
		const data: GH_Response = await octokit.graphql(query, {
			owner,
			repo,
			pr,
		});

		const participants = (data.repository.pullRequest.participants.nodes ?? [])
			.map(({ name, login, databaseId, email }) => ({
				name,
				login,
				id: databaseId,
				email,
			}))
			// remove the author from the list of participants
			.filter((p) => p.login !== author);

		if (participants.length === 0) {
			core.notice("No co-authors found");
			return;
		}
		core.info(`Found ${participants.length} co-authors`);
		const coauthorString = participants.map(createCoauthorString).join("\n");
		core.info("Created coauthor string");
		const commentBody = `\`\`\`\n${coauthorString}\n\`\`\``;
		const { data: comment } = await octokit.rest.issues.createComment({
			owner,
			repo,
			issue_number: pr,
			body: commentBody,
		});
		core.info(`Created comment id '${comment.id}' on pull request '${pr}'.`);
	} catch (error) {
		if (error instanceof Error) core.setFailed(error.message);
	}
}

run();
