import axios from 'axios';
const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000';

export const graphqlClient = {
    async query(query: string, variables: any) {
        const response = await axios.post(GRAPHQL_URI, {
            query,
            variables,
        });
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data;
    },
};

export const LIST_REPOS_QUERY = `
  query ListRepositories($token: String!) {
    listRepositories(token: $token) {
      name
      size
      owner
    }
  }
`;

export const GET_DETAILS_QUERY = `
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
`;
