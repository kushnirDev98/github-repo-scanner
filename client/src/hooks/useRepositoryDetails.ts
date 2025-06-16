import { useQuery } from '@tanstack/react-query';
import { graphqlClient, GET_DETAILS_QUERY } from '../api';
import { useGithubToken } from '../contexts';

export interface RepositoryDetails {
    name: string;
    size: number;
    owner: string;
    isPrivate: boolean;
    fileCount: number;
    ymlContent: string | null;
    activeWebhooks: string[];
}

interface GetRepositoryDetailsResponse {
    getRepositoryDetails: RepositoryDetails;
}

export function useRepositoryDetails(repoName: string, owner: string) {
    const { token } = useGithubToken();
    return useQuery<GetRepositoryDetailsResponse, Error, RepositoryDetails>({
        queryKey: ['repoDetails', token, repoName, owner],
        queryFn: () => graphqlClient.query(GET_DETAILS_QUERY, { token, repoName, owner }),
        select: (data) => data.getRepositoryDetails,
        enabled: !!token && !!repoName && !!owner,
        retry: false,
    });
}
