import React, { useState } from 'react';
import {
  Stack,
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { analyzeImage } from '../services/api';
import { InputAnalysisSchema } from '../types/analysis';
import { DragDrop } from './DragDrop';

export const ImageAnalysis: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    extractedText: string;
    analysis: InputAnalysisSchema;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeImage(imageFile);
      setResult(analysis);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', p: 2 }} alignItems="center">
      {!imagePreview && (
        <DragDrop
          onFileDrop={handleFileDrop}
          accept="image/*"
          maxSize={5}
        />
      )}

      {imagePreview && (
        <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <img 
            src={imagePreview} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              objectFit: 'contain' 
            }} 
          />
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
          </Button>
        </Stack>
      )}

      {loading && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">
            Processing your image...
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
                Extracted Text
              </Typography>
              <Typography variant="body1" paragraph>
                {result.extractedText}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Analysis
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Reasoning:</strong> {result.analysis.reasoning}
              </Typography>

              <Stack spacing={2}>
                {result.analysis.elements.map((element) => (
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
                <strong>Summary:</strong> {result.analysis.summary}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};
