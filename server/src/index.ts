import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers} from './application';

const server = new ApolloServer({ typeDefs, resolvers });

const port = process.env.PORT || 4000;

server.listen({ port })
    .then(({ url }) => console.log(`Server ready at ${url}`))
    .catch(err => console.error('Error starting server:', err));

