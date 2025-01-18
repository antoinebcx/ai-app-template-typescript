import axios from 'axios';
import { InputAnalysisSchema, ClassificationResult } from '../types/analysis';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

interface AnalysisResponse {
  analysis: InputAnalysisSchema;
  classification: ClassificationResult;
}

interface AudioAnalysisResponse extends AnalysisResponse {
  transcript: string;
}

interface ImageAnalysisResponse extends AnalysisResponse {
  extractedText: string;
}

export const analyzeText = async (text: string): Promise<AnalysisResponse> => {
  const response = await api.post<AnalysisResponse>('/analyze/text', { text });
  return response.data;
};

export const analyzeAudio = async (audioFile: File): Promise<AudioAnalysisResponse> => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  const response = await api.post<AudioAnalysisResponse>('/analyze/audio', formData);
  return response.data;
};

export const analyzeImage = async (imageFile: File): Promise<ImageAnalysisResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await api.post<ImageAnalysisResponse>('/analyze/image', formData);
  return response.data;
};
