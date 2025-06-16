import { createContext, useContext, useState, type ReactNode } from 'react';

interface GithubTokenContextType {
    token: string;
    setToken: (token: string) => void;
}

const GithubTokenContext = createContext<GithubTokenContextType | undefined>(undefined);

export function GithubTokenProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState('');
    return (
        <GithubTokenContext.Provider value={{ token, setToken }}>
            {children}
        </GithubTokenContext.Provider>
    );
}

export function useGithubToken() {
    const context = useContext(GithubTokenContext);
    if (!context) {
        throw new Error('useGitHubToken must be used within a GitHubTokenProvider');
    }
    return context;
}