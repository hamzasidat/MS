import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, List, ListItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box } from '@mui/material';

function DatasetPage() {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/stories');
                console.log('Fetched stories:', response.data);  // For debugging
                if (Array.isArray(response.data)) {
                    setStories(response.data);
                } else {
                    setError('Received invalid data format from server');
                }
            } catch (err) {
                setError('Failed to fetch stories');
                console.error('Error fetching stories:', err);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        fetchStories();
    }, []);

    const handleExport = () => {
        window.location.href = 'http://localhost:5000/api/export';
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Dataset
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {stories.slice(0, 20).map((story, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <Typography variant="body1">
                                    <strong>Name:</strong> {story.Name}, <strong>Age:</strong> {story.Age}, <strong>Gender:</strong> {story.Gender}, <strong>Ethnicity:</strong> {story['Ethnic Background']}, <strong>Interests:</strong> {story.Interest}. <br />
                                    <strong>Story:</strong>{story['LLM-Generated Personalized Story']}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                )}
                <Button variant="contained" color="primary" onClick={handleExport}>
                    Export
                </Button>
            </Paper>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Export Unavailable</DialogTitle>
                <DialogContent>
                    <Typography>Export is currently unavailable.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default DatasetPage;
