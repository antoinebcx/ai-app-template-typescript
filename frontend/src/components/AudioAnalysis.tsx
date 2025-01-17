import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  useTheme,
  Stack
} from '@mui/material';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import StopIcon from '@mui/icons-material/Stop';
import { analyzeAudio } from '../services/api';
import { InputAnalysisSchema, ClassificationResult } from '../types/analysis';
import { DragDrop } from './DragDrop';
import { Analysis } from './Analysis';
import { Classification } from './Classification';

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
    classification: ClassificationResult;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  const handleFileDrop = (file: File) => {
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
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
        ? '#ffffff'
        : '#000000',
      hover: theme.palette.mode === 'dark'
        ? '#e0e0e0'
        : '#404040'
    };
  };

  const colors = getButtonColors();

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', p: 2 }} alignItems="center">
      <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
        {!audioUrl && (
          <DragDrop
            onFileDrop={handleFileDrop}
            accept="audio/*"
            maxSize={10}
          />
        )}
        {!audioUrl && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            or
          </Typography>
        )}
        {!isProcessingRecording && (
          <Stack alignItems="center" spacing={1}>
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
            <Typography variant="body2" color="text.secondary">
              {isRecording ? formatTime(recordingTime) : 'Record'}
            </Typography>
          </Stack>
        )}
      </Stack>

      {audioUrl && (
        <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <audio controls src={audioUrl} style={{ width: '100%' }} />
        </Stack>
      )}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={loading || !audioUrl}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze audio'}
        </Button>
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography color="text.secondary">
            Processing your recording...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}

      {result && (
        <>
          <Analysis data={result.analysis} />
          <Classification data={result.classification} />
        </>
      )}
    </Stack>
  );
};
