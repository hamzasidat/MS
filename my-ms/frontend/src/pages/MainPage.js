import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Container, Grid, Paper, Typography, Box } from '@mui/material';
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

    const [story, setStory] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleValidation = () => {
        const { name, age, gender, ethnicity, interests } = formData;
        return name && age && gender && ethnicity && interests;
    };

    const [imageUrl, setImageUrl] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidation()) {
            setError('All mandatory fields must be filled out.');
            return;
        }
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/generate-story', formData);
            setStory(response.data.story);
            setImageUrl(response.data.image_url);
            document.getElementById('story-output').innerText = response.data.story;
            // Save the story to the dataset
            await axios.post('http://localhost:5000/api/save-story', {
                ...formData,
                story: response.data.story,
            });
        } catch (error) {
            console.error('Error generating story:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!handleValidation()) {
            setError('All mandatory fields must be filled out.');
            return;
        }
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/search-story', formData);
            setStory(response.data.story);
            document.getElementById('story-output').innerText = response.data.story;
        } catch (error) {
            console.error('Error searching story:', error);
        }
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
                            <TextField
                                label="Length"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
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
                    {story && <Typography variant="body1">{story}</Typography>}
                    {imageUrl && (
                        <Box mt={2}>
                            <img src={imageUrl} alt="Generated character" style={{ maxWidth: '100%', height: 'auto' }} />
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default MainPage;
