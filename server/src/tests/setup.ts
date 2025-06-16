import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers, typeDefs } from '../application';
import http from 'http';

let server: ApolloServer;
let httpServer: http.Server;
let url: string;

beforeAll(async () => {
    server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url: serverUrl } = await startStandaloneServer(server, { listen: { port: 0 } });
    url = serverUrl;
    httpServer = (server as any).httpServer;
});

afterAll(async () => {
    await server.stop();
    httpServer.close();
});

export { url, httpServer };
