import request from 'supertest';
import nock from 'nock';
import { url, httpServer } from 'tests/setup';

describe('GitHub Scanner Resolvers', () => {
    const mockToken = 'test-token';
    const owner = 'kushnirDev98';
    const repos = [
        { name: 'repoA', size: 16470, owner: { login: owner } },
        { name: 'repoB', size: 123, owner: { login: owner } },
        { name: 'repoC', size: 456, owner: { login: owner } },
    ];

    beforeEach(() => {
        nock('https://api.github.com')
            .persist()
            .get(/\/repos\/kushnirDev98\/repo[ABC]/)
            .reply(200, (uri) => {
                const repoName = uri.split('/').pop();
                return repos.find((repo) => repo.name === repoName);
            })
            .get(/\/repos\/kushnirDev98\/repoA\/contents\/.*\.yml/)
            .reply(200, { content: Buffer.from('key: value').toString('base64') })
            .get(/\/repos\/kushnirDev98\/repoA\/hooks/)
            .reply(200, [{ id: 1, url: 'https://example.com' }]);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should fetch repository list with correct sizes', async () => {
        const response = await request(httpServer)
            .post('/graphql')
            .send({
                query: `
          query ListRepositories($token: String!) {
            listRepositories(token: $token) {
              name
              size
              owner
            }
          }
        `,
                variables: { token: mockToken },
            });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data).toEqual({
            listRepositories: [
                { name: 'repoA', size: 16470, owner },
                { name: 'repoB', size: 123, owner },
                { name: 'repoC', size: 456, owner },
            ],
        });
    });

    it('should fetch repository details for repoA', async () => {
        const response = await request(httpServer)
            .post('/graphql')
            .send({
                query: `
          query GetRepositoryDetails($token: String!, $repoName: String!, $owner: String!) {
            getRepositoryDetails(token: $token, repoName: $repoName, owner: $owner) {
              name
              size
              owner
              isPrivate
              fileCount
              ymlContent
              activeWebhooks
            }
          }
        `,
                variables: { token: mockToken, repoName: 'repoA', owner },
            });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.getRepositoryDetails).toMatchObject({
            name: 'repoA',
            size: 16470,
            owner,
            isPrivate: expect.any(Boolean),
            fileCount: expect.any(Number),
            ymlContent: 'key: value',
            activeWebhooks: ['https://example.com'],
        });
    });

    it('should handle invalid token error', async () => {
        nock('https://api.github.com')
            .get('/repos/kushnirDev98/repoA')
            .reply(401, { message: 'Bad credentials' });

        const response = await request(httpServer)
            .post('/graphql')
            .send({
                query: `
          query ListRepositories($token: String!) {
            listRepositories(token: $token) {
              name
            }
          }
        `,
                variables: { token: 'invalid-token' },
            });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain('Bad credentials');
    });
});