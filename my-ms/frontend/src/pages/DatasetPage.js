import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, List, ListItem, Button } from '@mui/material';

function DatasetPage() {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
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
            }
        };
        fetchStories();
    }, []);

    const handleExport = () => {
        window.location.href = 'http://localhost:5000/api/export';
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Dataset
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <List>
                    {stories.slice(0, 20).map((story, index) => (
                        <ListItem key={index}>
                            {story}
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="primary" onClick={handleExport}>
                    Export
                </Button>
            </Paper>
        </Container>
    );
}

export default DatasetPage;
