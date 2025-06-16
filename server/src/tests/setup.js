"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.url = void 0;
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const application_1 = require("../application");
const application_2 = require("../application");
let server;
let httpServer;
let url;
beforeAll(async () => {
    server = new server_1.ApolloServer({
        typeDefs: application_2.typeDefs,
        resolvers: application_1.resolvers,
    });
    const { url: serverUrl } = await (0, standalone_1.startStandaloneServer)(server, { listen: { port: 0 } });
    exports.url = url = serverUrl;
    exports.httpServer = httpServer = server.httpServer;
});
afterAll(async () => {
    await server.stop();
    httpServer.close();
});
