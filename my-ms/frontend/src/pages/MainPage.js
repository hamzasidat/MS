import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Container, Grid, Paper, Typography, Box, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, FormHelperText } from '@mui/material';
import axios from 'axios';

function MainPage() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        ethnicity: '',
        interests: '',
        moral: '',
        length: '',
        includeImage: false,
    });

    const [stories, setStories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // Start with dialog closed

    useEffect(() => {
        // Check if the user has seen the welcome dialog
        const hasSeenDialog = localStorage.getItem('hasSeenDialog');
        if (!hasSeenDialog) {
            setDialogOpen(true);
            localStorage.setItem('hasSeenDialog', 'true');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleValidationForGeneration = () => {
        const { name, age, gender, ethnicity, interests } = formData;
        return name && age && gender && ethnicity && interests;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidationForGeneration()) {
            setError('All mandatory fields must be filled out.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('https://mirrorstories.me/api/generate-story', formData);
            setStories([response.data.story]);
            setImageUrl(response.data.image_url);
            // Save the story to the dataset
            await axios.post('https://mirrorstories.me/api/save-story', {
                ...formData,
                story: response.data.story,
            });
        } catch (error) {
            console.error('Error generating story:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('https://mirrorstories.me/api/search-story', formData);
            if (response.data.stories && response.data.stories.length > 0) {
                setStories(response.data.stories);
            } else {
                setStories([]); // Clear the stories if no matching story is found
                setError('No matching story found');
            }
        } catch (error) {
            console.error('Error searching story:', error);
            setError('No matching story found');
            setStories([]); // Clear the stories if there's an error
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Generate Story
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <FormHelperText>Name of the character. Ex: John</FormHelperText>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <FormHelperText>Age of the character. Ex: 25</FormHelperText>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <FormHelperText>Gender of the character. Ex: Male</FormHelperText>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Ethnicity"
                                name="ethnicity"
                                value={formData.ethnicity}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <FormHelperText>Ethnicity of the character. Ex: Indian</FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Interests"
                                name="interests"
                                value={formData.interests}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <FormHelperText>Interest of the character. Ex: Soccer</FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Optional Elements
                            </Typography>
                            <TextField
                                label="Moral"
                                name="moral"
                                value={formData.moral}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <FormHelperText>Moral of the story. Ex: Honesty is the best policy</FormHelperText>
                            <TextField
                                label="Length"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <FormHelperText>Length of the story in words. Ex: 500</FormHelperText>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.includeImage}
                                        onChange={handleChange}
                                        name="includeImage"
                                    />
                                }
                                label="Include Image"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Generate Story
                            </Button>
                            <Button onClick={handleSearch} variant="contained" color="secondary" fullWidth style={{ marginTop: '10px' }}>
                                Search Story in Dataset
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {error && <Typography color="error">{error}</Typography>}
                <Box mt={4} id="story-output">
                    {stories.length > 0 && stories.map((story, index) => (
                        <Typography key={index} variant="body1" style={{ marginBottom: '10px' }}>
                            {story}
                        </Typography>
                    ))}
                    {imageUrl && (
                        <Box mt={2}>
                            <img src={imageUrl} alt="Generated character" style={{ maxWidth: '100%', height: 'auto' }} />
                        </Box>
                    )}
                </Box>
            </Paper>
            <Dialog open={loading}>
                <DialogContent>
                    <DialogContentText>Generating story, please wait...</DialogContentText>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Welcome to the MirrorStories!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can generate stories by entering all the mandatory fields: Name, Age, Gender, Ethnicity, and Interests.
                        Optionally, you can include a Moral and specify the Length of the story. You can also choose to include an image.
                        If you want to search for existing stories, you can filter them based on any one of the field provided.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default MainPage;
