import { Run } from '../src/action';
import { Server } from '../src/server';
import { fail } from 'assert';

describe('Run', () => {
    it('passes when the number of commits do not exceed the limit', async () => {
        const serverMock: Server = {
            fetchMaxCommits: jest.fn(() => 3),
            fetchActualCommits: jest.fn(async () => 2),
            reportFailure: jest.fn(() => { fail('It should not be called'); })
        };

        await Run(serverMock);
    });

    it('passes when the number of commits is equal to the limit', async () => {
        const serverMock: Server = {
            fetchMaxCommits: jest.fn(() => 3),
            fetchActualCommits: jest.fn(async () => 3),
            reportFailure: jest.fn(() => { fail('It should not be called'); })
        };

        await Run(serverMock);
    });

    it('fails when the number of commits exceeds the limit', async () => {
        let failureMsg = '';
        const serverMock: Server = {
            fetchMaxCommits: jest.fn(() => 3),
            fetchActualCommits: jest.fn(async () => 4),
            reportFailure: jest.fn((msg) => { failureMsg = msg; }),
        };

        await Run(serverMock);

        expect(failureMsg).toBe('This pull request currently has 4 commits, but it should have no more than 3. Please consolidate your commits.')
    });
});