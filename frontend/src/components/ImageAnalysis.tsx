import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { analyzeImage } from '../services/api';
import { InputAnalysisSchema } from '../types/analysis';

export const ImageAnalysis: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    extractedText: string;
    analysis: InputAnalysisSchema;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileUpload}
        />
      </Button>

      {imagePreview && (
        <Box sx={{ mb: 2 }}>
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
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
          </Button>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Extracted Text
          </Typography>
          <Typography variant="body1" paragraph>
            {result.extractedText}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Analysis
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Reasoning:</strong> {result.analysis.reasoning}
          </Typography>

          {result.analysis.elements.map((element) => (
            <Box key={element.elementNumber} sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>{element.elementNumber}. {element.elementName}</strong>
              </Typography>
              <Typography variant="body2">
                {element.elementDescription}
              </Typography>
            </Box>
          ))}

          <Typography variant="body1">
            <strong>Summary:</strong> {result.analysis.summary}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
