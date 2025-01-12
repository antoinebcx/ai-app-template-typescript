import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  useTheme
} from '@mui/material';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import StopIcon from '@mui/icons-material/Stop';
import { analyzeAudio } from '../services/api';
import { InputAnalysisSchema } from '../types/analysis';

export const AudioAnalysis: React.FC = () => {
  const theme = useTheme();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    transcript: string;
    analysis: InputAnalysisSchema;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
  
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
  
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
        const file = new File([audioBlob], 'recording.mp3', { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        setAudioFile(file);
        setAudioUrl(url);
        setIsProcessingRecording(true);
        stream.getTracks().forEach(track => track.stop());
      };
  
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!audioFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await analyzeAudio(audioFile);
      setResult(analysis);
    } catch (err) {
      setError('Failed to analyze audio. Please try again.');
    } finally {
      setLoading(false);
      setIsProcessingRecording(false);
    }
  };

  const getButtonColors = () => {
    if (isRecording) {
      return {
        background: '#ff4444',
        hover: '#cc0000'
      };
    }
    return {
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, #ffffff 0%, #bbbbbb 100%)'
        : 'linear-gradient(180deg, #000000 0%, #383838 100%)',
      hover: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #e0e0e0 0%, #bdbdbd 100%)'
        : 'linear-gradient(180deg, #404040 0%, #1a1a1a 100%)'
    };
  };

  const colors = getButtonColors();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          component="label"
        >
          Upload Audio
          <input
            type="file"
            hidden
            accept="audio/*"
            onChange={handleFileUpload}
          />
        </Button>
        
        {!isProcessingRecording && (
          <Button
            variant="contained"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            sx={{
              borderRadius: '50%',
              width: 55,
              height: 55,
              minWidth: 55,
              background: colors.background,
              color: isRecording ? '#ffffff' : (theme.palette.mode === 'dark' ? '#000000' : '#ffffff'),
              '&:hover': {
                background: colors.hover,
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isRecording ? 
              <StopIcon sx={{ fontSize: '28px' }} /> : 
              <FiberManualRecordRoundedIcon sx={{ fontSize: '28px' }} />
            }
          </Button>
        )}
      </Box>

      {audioUrl && (
        <Box sx={{ mb: 2 }}>
          <audio controls src={audioUrl} />
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Analyze Audio'}
          </Button>
        </Box>
      )}

      {loading && (
        <Grid
          sx={{
            mt: 2,
            gap: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body1" color="text.secondary">
            Processing your recording...
          </Typography>
        </Grid>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Transcript
          </Typography>
          <Typography variant="body1" paragraph>
            {result.transcript}
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
