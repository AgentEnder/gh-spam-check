import { RequestError } from "octokit";

export function tryOctokitRequest<T>(fn: () => Promise<T>) {
    return fn().catch((error) => {
        console.error('Error creating comment:', error)
        if (error instanceof RequestError) {
            console.error('Error status:', error.status)
            console.error('Error message:', error.message)
            console.error('Error cause:', error.cause)
            console.error('Error request:', JSON.stringify(error.request, null, 2))
        }
        throw error;
    });
}