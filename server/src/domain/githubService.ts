import { GitHubRepository } from '../infrastructure';
import { Repository } from './repository';

export class GithubService {
    constructor(private githubRepository: GitHubRepository) {
    }

    async listRepositories(token: string, owner: string, repoNames: string[]) {
        const listRepositories = await this.githubRepository.listRepositories(token, owner, repoNames);
        return listRepositories.map(repo => Repository.createListItem(repo));
    }

    async getRepositoryDetails(token: string, owner: string, repoName: string) {
        const data = await this.githubRepository.getRepositoryDetails(token, owner, repoName);
        return new Repository(
            data.name,
            data.size,
            data.owner,
            data.isPrivate,
            data.fileCount,
            data.ymlContent,
            data.activeWebhooks
        );
    }
}
