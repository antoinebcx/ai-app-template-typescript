import React, { useState } from 'react';
import {
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Enter text to analyze"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Button
        variant="contained"
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Analyze Text'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Analysis Result
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Reasoning:</strong> {result.reasoning}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Elements:
          </Typography>
          
          {result.elements.map((element) => (
            <Box key={element.elementNumber} sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>{element.elementNumber}. {element.elementName}</strong>
              </Typography>
              <Typography variant="body2">
                {element.elementDescription}
              </Typography>
            </Box>
          ))}

          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Summary:</strong> {result.summary}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
