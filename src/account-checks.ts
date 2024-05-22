import { User } from "@octokit/webhooks-types";
import { Octokit } from "octokit";

// If an account is less than 30 days old it is more likely to be a spam account.
//                mills<-sec<-min<-hrs<-days
const threshold = 1000 * 60 * 60 * 24 * 30;

export async function checkAccountAge(octokit: Octokit, user: User) {
    const account = await octokit.rest.users.getByUsername({
        username: user.login,
    });
    const accountAge = Date.now() - new Date(account.data.created_at).getTime();
    console.log('Account age:', accountAge);
    return accountAge > threshold;
}
