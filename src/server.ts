export interface Server {
    fetchMaxCommits(): number;
    fetchActualCommits(): Promise<number>;
    reportFailure(message: string): void;
}