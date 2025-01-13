import React, { useState } from 'react';
import {
  Stack,
  Box,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { analyzeImage } from '../services/api';
import { InputAnalysisSchema } from '../types/analysis';
import { DragDrop } from './DragDrop';
import { Analysis } from './Analysis';

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
        </Stack>
      )}

      <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={loading || !imagePreview}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze image'}
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        <Analysis data={result} />
      )}
    </Stack>
  );
};
