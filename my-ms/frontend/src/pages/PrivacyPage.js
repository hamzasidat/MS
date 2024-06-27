import React from 'react';
import { Container, Paper, Typography } from '@mui/material';

function PrivacyPage() {
    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="body1">
                    Your privacy is our top priority. We want to assure you that we do not collect, store, or share any personal information when you use our services. Your interactions with our platform are entirely anonymous and secure. Enjoy peace of mind while using our personalized story creator, knowing that your privacy is fully protected.
                </Typography>
            </Paper>
        </Container>
    );
}

export default PrivacyPage;
