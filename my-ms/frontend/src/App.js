import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DatasetPage from './pages/DatasetPage';
import PrivacyPage from './pages/PrivacyPage';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme();

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textDecoration: 'none',
  color: 'inherit',
}));

const NavLinks = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

function App() {
  console.log('App Component Rendered');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <AppBarStyled position="static">
            <Toolbar>
              <Title variant="h6" component={Link} to="/">
                MirrorStories
              </Title>
              <NavLinks>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/dataset">Dataset</Button>
                <Button color="inherit" component={Link} to="/privacy">Privacy</Button>
              </NavLinks>
            </Toolbar>
          </AppBarStyled>
          <Container>
            <Routes>
              <Route exact path="/" element={<MainPage />} />
              <Route path="/dataset" element={<DatasetPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
