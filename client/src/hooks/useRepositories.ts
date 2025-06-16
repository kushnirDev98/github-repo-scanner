import { useQuery } from '@tanstack/react-query';
import { graphqlClient, LIST_REPOS_QUERY } from '../api';
import { useGithubToken } from '../contexts';

export interface Repository {
    name: string;
    size: number;
    owner: string;
}

interface ListRepositoriesResponse {
    listRepositories: Repository[];
}

export function useRepositories(fetchTriggered: boolean) {
    const { token } = useGithubToken();
    return useQuery<ListRepositoriesResponse, Error, Repository[]>({
        queryKey: ['repositories', token],
        queryFn: () => graphqlClient.query(LIST_REPOS_QUERY, { token }),
        enabled: fetchTriggered && !!token,
        select: (data) => data.listRepositories,
        retry: false,
    });
}
