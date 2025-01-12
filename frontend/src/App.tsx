import { useState, useMemo } from 'react';
import { Container, Typography, Box, Tab, Tabs, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import { TextAnalysis } from './components/TextAnalysis';
import { AudioAnalysis } from './components/AudioAnalysis';
import { ImageAnalysis } from './components/ImageAnalysis';
import { getDesignTokens } from './theme/theme';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [tabIndex, setTabIndex] = useState(0);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const handleTabChange = (_event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar onToggleColorMode={toggleColorMode} />
      <Container maxWidth="lg">
        <Box sx={{ mt: 10, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 450 }}>
            AI app template
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
            This app demonstrates how to use AI services to extract information
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
            in a structured way from text, audio, and images.
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="Text" />
              <Tab label="Audio" />
              <Tab label="Image" />
            </Tabs>
          </Box>

          <Box sx={{ mt: 4 }}>
            {tabIndex === 0 && <TextAnalysis />}
            {tabIndex === 1 && <AudioAnalysis />}
            {tabIndex === 2 && <ImageAnalysis />}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
