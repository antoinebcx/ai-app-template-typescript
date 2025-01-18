import React, { useState } from 'react';
import {
  Stack,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  useTheme
} from '@mui/material';
import { analyzeText } from '../services/api';
import { InputAnalysisSchema, ClassificationResult } from '../types/analysis';
import { Analysis } from './Analysis';
import { Classification } from './Classification';

export const TextAnalysis: React.FC = () => {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InputAnalysisSchema | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeText(text);
      setResult(response.analysis);
      setClassification(response.classification);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', p: 2 }} alignItems="center">
      <TextField
        fullWidth
        multiline
        rows={7}
        variant="outlined"
        label="Enter text to analyze"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.01)',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
            },
            '& fieldset': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              borderStyle: 'dashed',
            },
            '&:hover fieldset': {
              borderColor: theme.palette.text.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.text.primary,
            }
          }
        }}
      />

      <Button
        variant="contained"
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
      >
        {loading ? <CircularProgress size={24} /> : 'Analyze text'}
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

      {result && <Analysis data={result} />}
      {classification && <Classification data={classification} />}
    </Stack>
  );
};
