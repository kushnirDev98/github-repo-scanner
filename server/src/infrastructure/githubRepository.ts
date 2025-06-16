import axios from 'axios';
import pLimit from 'p-limit';
import 'dotenv/config';

const GITHUB_API = process.env.GITHUB_API_URL || 'https://api.github.com';
const OWNER = process.env.GITHUB_USER_NAME || 'YOUR_GITHUB_USERNAME';
const limit = pLimit(2); // Limit to 2 parallel scans

export class GitHubRepository {
    async listRepositories(token: string, owner: string = OWNER, repoNames: string[] = ['repoA', 'repoB', 'repoC']) {
        try {
            const results = await Promise.all(
                repoNames.map(repo =>
                    limit(async () => {
                        const { data } = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        return { name: data.name, size: data.size, owner: data.owner.login };
                    })
                )
            );
            return results;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(`GitHub API error: ${error.message}`);
            }
            throw new Error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);        }
    }

    async getRepositoryDetails(token: string, owner: string = OWNER, repoName: string) {
        try {
            const { data: repo } = await axios.get(`${GITHUB_API}/repos/${owner}/${repoName}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { data: tree } = await axios.get(`${GITHUB_API}/repos/${owner}/${repoName}/git/trees/${repo.default_branch}?recursive=1`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fileCount = tree.tree.length;
            const ymlFile = tree.tree.find((file: any) => file.path.endsWith('.yml') || file.path.endsWith('.yaml'));
            let ymlContent = null;
            if (ymlFile) {
                const { data: content } = await axios.get(`${GITHUB_API}/repos/${owner}/${repoName}/contents/${ymlFile.path}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                ymlContent = Buffer.from(content.content, 'base64').toString();
            }
            const { data: webhooks } = await axios.get(`${GITHUB_API}/repos/${owner}/${repoName}/hooks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const activeWebhooks = webhooks.map((hook: any) => hook.config.url).filter(Boolean);
            return {
                name: repo.name,
                size: repo.size,
                owner: repo.owner.login,
                isPrivate: repo.private,
                fileCount,
                ymlContent,
                activeWebhooks,
            };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(`GitHub API error: ${error.message}`);
            }
            throw new Error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
