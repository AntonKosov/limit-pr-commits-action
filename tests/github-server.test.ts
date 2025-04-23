jest.mock('@actions/github', () => ({
    getOctokit: jest.fn(),
}));

jest.mock('@actions/core', () => ({
    setFailed: jest.fn(),
    getInput: jest.fn(),
}));

import { GitHubServer } from '../src/github-server';
import * as github from '@actions/github';
import * as core from '@actions/core';

describe('GitHubServer', () => {
    const getInputMock = core.getInput as jest.Mock;
    const mockInput = new Map<string, string>();

    beforeAll(() => {
        getInputMock.mockImplementation(jest.fn((inputName: string): string => {
            const resp = mockInput.get(inputName);
            expect(resp).toBeDefined();
            return resp!;
        }));
    });

    beforeEach(() => {
        mockInput.clear();
    });

    describe('fetchMaxCommits', () => {
        it('returns correct max commits', () => {
            mockInput.set('max-commits', '5');

            const server = new GitHubServer();
            const maxCommits = server.fetchMaxCommits();

            expect(maxCommits).toBe(5);
        });
    });

    describe('reportFailure', () => {
        const setFailedMock = core.setFailed as jest.Mock;

        afterEach(() => {
            setFailedMock.mockClear();
        });

        it('passes the message', () => {
            const server = new GitHubServer();
            server.reportFailure('something went wrong');

            expect(setFailedMock).toHaveBeenCalledTimes(1);
            expect(setFailedMock).toHaveBeenCalledWith('something went wrong');
        });
    });

    describe('fetchActualCommits', () => {
        const getPullRequestMock = jest.fn().mockResolvedValue({ data: { commits: 5 } });
        const getOctokitMock = github.getOctokit as jest.Mock;
        const octokitMock = {
            rest: {
                pulls: {
                    get: getPullRequestMock,
                },
            },
        };

        beforeAll(() => {
            getOctokitMock.mockReturnValue(octokitMock);
        });

        afterEach(() => {
            getPullRequestMock.mockClear();
        });

        it('fetches the correct number of actual commits', async () => {
            const token = 'secret-token';
            const owner = 'repo-owner';
            const repo = 'awesome-repo';
            const pullRequest = 345;
            mockInput.set('github-token', token);
            mockInput.set('pull-request-number', `${pullRequest}`);
            process.env['GITHUB_REPOSITORY_OWNER'] = owner;
            process.env['GITHUB_REPOSITORY'] = `${owner}/${repo}`;

            const server = new GitHubServer();
            const actualCommits = await server.fetchActualCommits();

            expect(getOctokitMock).toHaveBeenCalledWith(token);
            expect(getPullRequestMock).toHaveBeenCalledWith({
                owner: owner,
                repo: repo,
                pull_number: pullRequest,
            });
            expect(actualCommits).toBe(5);
        });
    });
});
