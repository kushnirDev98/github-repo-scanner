import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { GithubTokenProvider } from './contexts';
import App from './App';
import { theme } from './theme';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <GithubTokenProvider>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </GithubTokenProvider>
        </QueryClientProvider>
    </React.StrictMode>
);