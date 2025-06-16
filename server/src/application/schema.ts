import { gql } from 'apollo-server';

export const typeDefs = gql`
  type RepositoryList {
    name: String!
    size: Int!
    owner: String!
  }
  type RepositoryDetails {
    name: String!
    size: Int!
    owner: String!
    isPrivate: Boolean!
    fileCount: Int!
    ymlContent: String
    activeWebhooks: [String!]!
  }
  type Query {
    listRepositories(token: String!): [RepositoryList!]!
    getRepositoryDetails(token: String!, repoName: String!, owner: String!): RepositoryDetails!
  }
`;
