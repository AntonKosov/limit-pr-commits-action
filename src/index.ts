import * as core from '@actions/core';
import * as github from '@actions/github';

async function main(): Promise<void> {
    const token = core.getInput('github-token');
    const maxCommits = parseInt(core.getInput('max-commits'));
    const pullRequestNumber = parseInt(core.getInput('pull-request-number'));

    const owner = process.env.GITHUB_REPOSITORY_OWNER as string;
    const repo = (process.env.GITHUB_REPOSITORY as string).split('/')[1];

    const octokit = github.getOctokit(token);
    const resp = await octokit.rest.pulls.get({ owner: owner, repo: repo, pull_number: pullRequestNumber });

    const actualCommits = resp.data.commits;
    if (actualCommits > maxCommits) {
        core.setFailed(`The number of commits should not exceed ${maxCommits}. Currently, the pull request has ${actualCommits} commits.`)
    }
}

main();
