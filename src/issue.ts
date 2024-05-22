import { IssuesOpenedEvent } from "@octokit/webhooks-types";
import { Octokit, RequestError } from "octokit";
import { tryOctokitRequest } from "./utils";

export async function markIssueAsSpam(
    octokit: Octokit,
    event: IssuesOpenedEvent
) {
    const owner = event.repository.owner.login;
    const repo = event.repository.name;
    const issue_number = event.issue.number;
    await tryOctokitRequest(() =>
        octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body: `This ${
                "discussion" in event ? "discussion" : "issue"
            } was flagged as spam and has been closed.`,
        })
    );

    // We should close the discussion
    tryOctokitRequest(() =>
        octokit.rest.issues.update({
            owner,
            repo,
            issue_number,
            state: "closed",
        })
    );
    // If the discussion is not allowed, we can lock it immediately.

    tryOctokitRequest(() =>
        octokit.rest.issues.lock({
            owner,
            repo,
            issue_number,
        })
    );
}
