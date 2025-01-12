import axios from 'axios';
import { InputAnalysisSchema } from '../types/analysis';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const analyzeText = async (text: string): Promise<InputAnalysisSchema> => {
  const response = await api.post('/analyze/text', { text });
  return response.data;
};

export const analyzeAudio = async (audioFile: File): Promise<{
  transcript: string;
  analysis: InputAnalysisSchema;
}> => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  const response = await api.post('/analyze/audio', formData);
  return response.data;
};

export const analyzeImage = async (imageFile: File): Promise<{
  extractedText: string;
  analysis: InputAnalysisSchema;
}> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await api.post('/analyze/image', formData);
  return response.data;
};
