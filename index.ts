import { Octokit } from "octokit";
import {
    DiscussionCreatedEvent,
    IssuesOpenedEvent,
} from "@octokit/webhooks-types";

import { checkTextContent } from "./src/text-content-checks";
import { checkAccountAge } from "./src/account-checks";
import { markDiscussionAsSpam } from "./src/discussion";
import { markIssueAsSpam } from "./src/issue";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const event: DiscussionCreatedEvent | IssuesOpenedEvent = await Bun.file(
    "event.json"
).json();

const owner: string = event.repository.owner.login;
const repo: string = event.repository.name;
const issue_number =
    "issue" in event ? event.issue.number : event.discussion.number;

const textContent =
    "discussion" in event
        ? event.discussion.title + event.discussion.body
        : event.issue.title + event.issue.body;

const allowed =
    // (await checkAccountAge(octokit, event.sender)) ||
    checkTextContent(textContent);

if (!allowed) {
    // Leave a comment that the discussion was flagged as spam.
    console.log('Creating comment')

    if ("discussion" in event) {
        await markDiscussionAsSpam(octokit, event);
    } else {
        await markIssueAsSpam(octokit, event);
    }
}
