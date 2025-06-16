import { Card, CardContent, Typography, Alert, CircularProgress, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRepositoryDetails } from '../hooks';

interface RepositoryDetailsProps {
    repoName: string;
    owner: string;
    onClose: () => void;
}

export function RepositoryDetails({ repoName, owner, onClose }: RepositoryDetailsProps) {
    const { data, isLoading, error } = useRepositoryDetails(repoName, owner);

    if (isLoading) return <CircularProgress style={{ margin: 20 }} />;
    if (error) return <Alert severity="error" style={{ margin: 20 }}>Error: {error.message}</Alert>;
    if (!data) return null;

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                        {data.name}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box mb={2}>
                    <Typography><strong>Size:</strong> {data.size} KB</Typography>
                    <Typography><strong>Owner:</strong> {data.owner}</Typography>
                    <Typography><strong>Private:</strong> {data.isPrivate ? 'Yes' : 'No'}</Typography>
                    <Typography><strong>File Count:</strong> {data.fileCount}</Typography>
                    <Typography component="div">
                        <strong>YML Content:</strong>
                        {data.ymlContent ? (
                            <Box
                                component="pre"
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    padding: 2,
                                    borderRadius: 1,
                                    maxHeight: 400,
                                    overflow: 'auto',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {data.ymlContent}
                            </Box>
                        ) : (
                            ' None'
                        )}
                    </Typography>
                    <Typography><strong>Active Webhooks:</strong> {data.activeWebhooks.join(', ') || 'None'}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
