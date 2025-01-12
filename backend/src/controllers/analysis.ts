import { Request, Response } from 'express';
import { llmAnalysis, audioTranscription, imageToText } from '../ai/services';

export async function analyzeText(req: Request, res: Response) {
  try {
    const { text } = req.body;
    const analysis = await llmAnalysis(text);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze text' });
  }
}

export async function analyzeAudio(req: Request, res: Response) {
  try {
    const audioBuffer = req.file?.buffer;
    if (!audioBuffer) throw new Error('No audio file provided');
    
    const transcript = await audioTranscription(audioBuffer);
    const analysis = await llmAnalysis(transcript);
    
    res.json({
      transcript,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze audio' });
  }
}

export async function analyzeImage(req: Request, res: Response) {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) throw new Error('No image file provided');
    
    const extractedText = await imageToText(imageBuffer);
    const analysis = await llmAnalysis(extractedText);
    
    res.json({
      extractedText,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze image' });
  }
}
