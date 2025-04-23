import { Server } from "./server";

export async function Run(server: Server) {
    const maxCommits = server.fetchMaxCommits();
    const actualCommits = await server.fetchActualCommits();

    if (actualCommits > maxCommits) {
        server.reportFailure(`This pull request currently has ${actualCommits} commits, but it should have no more than ${maxCommits}. Please consolidate your commits.`)
    }
}