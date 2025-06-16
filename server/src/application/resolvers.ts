import 'dotenv/config';
import { GithubService } from '../domain';
import { GitHubRepository } from '../infrastructure';

const githubRepo = new GitHubRepository();
const githubService = new GithubService(githubRepo);
const owner = process.env.GITHUB_USER_NAME || 'YOUR_GITHUB_USERNAME';

export const resolvers = {
    Query: {
        listRepositories: async (_: any, { token }: { token: string }) => {
            const repoNames = ['repoA', 'repoB', 'repoC'];
            return githubService.listRepositories(token, owner, repoNames);
        },
        getRepositoryDetails: async (_: any, { token, repoName, owner: queryOwner }: { token: string; repoName: string; owner: string }) => {
            return githubService.getRepositoryDetails(token, queryOwner || owner, repoName);
        },
    }
}