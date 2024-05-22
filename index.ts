import { Octokit } from "octokit";
import {
    DiscussionCreatedEvent,
    IssuesOpenedEvent,
} from "@octokit/webhooks-types";

import { checkTextContent } from "./src/text-content-checks";
import { checkAccountAge } from "./src/account-checks";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const event: DiscussionCreatedEvent | IssuesOpenedEvent =
    JSON.parse("event.json");

(async () => {
    const owner: string = event.repository.owner.login;
    const repo: string = event.repository.name;
    const issue_number =
        "issue" in event ? event.issue.number : event.discussion.number;

    const textContent =
        "discussion" in event
            ? event.discussion.title + event.discussion.body
            : event.issue.title + event.issue.body;

    const allowed = await checkAccountAge(octokit, event.sender.id) || checkTextContent(textContent);

    if (!allowed) {
        // Leave a comment that the discussion was flagged as spam.
        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body: `This ${
                "discussion" in event ? "discussion" : "issue"
            } was flagged as spam and has been closed.`,
        });
        // We should close the discussion
        await octokit.rest.issues.update({
            owner,
            repo,
            issue_number,
            state: "closed",
        });
        // If the discussion is not allowed, we can lock it immediately.
        await octokit.rest.issues.lock({
            owner,
            repo,
            issue_number,
        });
    }
})()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
