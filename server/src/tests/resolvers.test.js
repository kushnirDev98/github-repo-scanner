"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const nock_1 = __importDefault(require("nock"));
const setup_1 = require("/server/src/tests/setup");
describe('GitHub Scanner Resolvers', () => {
    const mockToken = 'test-token';
    const owner = 'kushnirDev98';
    const repos = [
        { name: 'repoA', size: 16470, owner: { login: owner } },
        { name: 'repoB', size: 123, owner: { login: owner } },
        { name: 'repoC', size: 456, owner: { login: owner } },
    ];
    beforeEach(() => {
        (0, nock_1.default)('https://api.github.com')
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
        nock_1.default.cleanAll();
    });
    it('should fetch repository list with correct sizes', async () => {
        const response = await (0, supertest_1.default)(setup_1.httpServer)
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
        const response = await (0, supertest_1.default)(setup_1.httpServer)
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
        (0, nock_1.default)('https://api.github.com')
            .get('/repos/kushnirDev98/repoA')
            .reply(401, { message: 'Bad credentials' });
        const response = await (0, supertest_1.default)(setup_1.httpServer)
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
