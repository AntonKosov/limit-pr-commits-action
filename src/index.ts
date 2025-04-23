import { Run } from "./action";
import { GitHubServer } from "./github-server";

const server = new GitHubServer();
Run(server);
