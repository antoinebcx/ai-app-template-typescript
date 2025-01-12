import React, { useState } from 'react';
import {
  Stack,
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { analyzeText } from '../services/api';
import { InputAnalysisSchema } from '../types/analysis';

export const TextAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InputAnalysisSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeText(text);
      setResult(analysis);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', p: 2 }} alignItems="center">
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Enter text to analyze"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <Button
        variant="contained"
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
      >
        {loading ? <CircularProgress size={24} /> : 'Analyze Text'}
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">
            Processing your text...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}

      {result && (
        <Paper sx={{ p: 3, width: '100%' }} elevation={0}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Analysis Result
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Reasoning:</strong> {result.reasoning}
              </Typography>

              <Stack spacing={2}>
                {result.elements.map((element) => (
                  <Box key={element.elementNumber}>
                    <Typography variant="body1" gutterBottom>
                      <strong>{element.elementNumber}. {element.elementName}</strong>
                    </Typography>
                    <Typography variant="body2">
                      {element.elementDescription}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Summary:</strong> {result.summary}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};
