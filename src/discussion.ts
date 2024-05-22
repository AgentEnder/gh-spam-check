import { DiscussionCreatedEvent } from "@octokit/webhooks-types";
import { Octokit } from "octokit";

export async function markDiscussionAsSpam(
    octokit: Octokit,
    discussion: DiscussionCreatedEvent
) {
    // Discussions are only available via graphql api
    // Comment that discussion is closed as spam. This will email author, so it will be seen even though we delete the discussion.
    await octokit.graphql(`
        mutation {
            addDiscussionComment(input: {
                discussionId: "${discussion.discussion.node_id}",
                body: "This discussion was flagged as spam and has been closed."
            }) {
                clientMutationId
            }
        }
    `);

    // Delete the discussion
    await octokit.graphql(`
        mutation {
            deleteDiscussion(input: {
                id: "${discussion.discussion.node_id}"
            }) {
                clientMutationId
            }
        }
    `);
}
