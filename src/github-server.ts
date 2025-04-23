import { Server } from "./server"
import * as core from '@actions/core';
import * as github from '@actions/github';

export class GitHubServer implements Server {
    fetchMaxCommits(): number {
        return parseInt(core.getInput('max-commits'));
    }

    async fetchActualCommits(): Promise<number> {
        const token = core.getInput('github-token');
        const pullRequestNumber = parseInt(core.getInput('pull-request-number'));

        const owner = process.env.GITHUB_REPOSITORY_OWNER as string;
        const repo = (process.env.GITHUB_REPOSITORY as string).split('/')[1];

        const octokit = github.getOctokit(token);
        const resp = await octokit.rest.pulls.get({ owner: owner, repo: repo, pull_number: pullRequestNumber });

        return resp.data.commits;
    }

    reportFailure(message: string): void {
        core.setFailed(message)
    }
}