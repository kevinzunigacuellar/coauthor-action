import * as core from "@actions/core";
import * as github from "@actions/github";
import { query } from "./constants.js";
import type { GH_Response } from "./types.js";
import { createCoauthorString } from "./utils.js";

async function run() {
	const label = core.getInput("label");
	const prContext = github.context.payload.pull_request;

	try {
		// if (github.context.payload.action !== "labeled") {
		// 	core.notice("Skipping, not a label event");
		// 	return;
		// }

		// if (github.context.payload.label.name !== label) {
		// 	core.notice("Skipping, label does not match");
		// 	return;
		// }
		
		console.log("comment", github.context.payload.comment);
		if (!prContext) {
			core.notice("Skipping, missing pull request context");
			return;
		}

		const token = core.getInput("token", { required: true });
		const octokit = github.getOctokit(token);
		const pr = prContext.number;
		const author = prContext.user.login;
		const { owner, repo } = github.context.repo;

		const data: GH_Response = await octokit.graphql(query, {
			owner,
			repo,
			pr,
		});

		const participants = (data.repository.pullRequest.participants.nodes ?? [])
			.map(({ name, login, databaseId }) => ({
				name,
				login,
				id: databaseId,
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
