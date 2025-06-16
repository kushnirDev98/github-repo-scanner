import { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Alert, CircularProgress, Snackbar, Dialog } from '@mui/material';
import { useRepositories } from '../hooks';
import { useGithubToken } from '../contexts';
import { RepositoryDetails } from './RepositoryDetails';

export function RepositoryList() {
    const { token, setToken } = useGithubToken();
    const [fetchTriggered, setFetchTriggered] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState<{ name: string; owner: string } | null>(null);
    const { data, isLoading, error, refetch } = useRepositories(fetchTriggered);

    const handleFetch = () => {
        if (token) {
            setFetchTriggered(true);
            refetch();
            setSnackbarOpen(true);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                GitHub Scanner
            </Typography>
            <TextField
                label="GitHub Personal Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!token && fetchTriggered}
                helperText={!token && fetchTriggered ? 'Token is required' : ''}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFetch}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                style={{ marginBottom: 20 }}
            >
                {isLoading ? 'Fetching...' : 'Fetch Repositories'}
            </Button>
            {error && <Alert severity="error" style={{ marginBottom: 20 }}>Error: {error.message}</Alert>}
            {data && Array.isArray(data) && data.length > 0 ? (
                <>
                    <Typography variant="h6" gutterBottom>
                        Repositories
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Size (KB)</TableCell>
                                <TableCell>Owner</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((repo) => (
                                <TableRow
                                    key={repo.name}
                                    onClick={() => setSelectedRepo({ name: repo.name, owner: repo.owner })}
                                    style={{ cursor: 'pointer' }}
                                    hover
                                >
                                    <TableCell>{repo.name}</TableCell>
                                    <TableCell>{repo.size}</TableCell>
                                    <TableCell>{repo.owner}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            ) : (
                data && <Typography>No repositories found.</Typography>
            )}
            <Dialog open={!!selectedRepo} onClose={() => setSelectedRepo(null)} maxWidth="sm" fullWidth>
                {selectedRepo && (
                    <RepositoryDetails
                        repoName={selectedRepo.name}
                        owner={selectedRepo.owner}
                        onClose={() => setSelectedRepo(null)}
                    />
                )}
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message="Repositories fetched successfully!"
            />
        </div>
    );
}
